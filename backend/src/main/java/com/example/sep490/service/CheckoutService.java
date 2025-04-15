package com.example.sep490.service;

import com.example.sep490.dto.OrderRequest;
import com.example.sep490.dto.cart.Cart;
import com.example.sep490.dto.cart.ItemCart;
import com.example.sep490.dto.cart.ShopCart;
import com.example.sep490.entity.*;
import com.example.sep490.entity.compositeKeys.OrderDetailId;
import com.example.sep490.entity.enums.DeliveryMethod;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.repository.AddressRepository;
import com.example.sep490.repository.ProductRepository;
import com.example.sep490.repository.ProductSKURepository;
import com.example.sep490.repository.ShopRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private static final BigDecimal COMMISSION_RATE = new BigDecimal("0.10"); // 10%
    private static final BigDecimal PAYMENT_GATEWAY_FEE = new BigDecimal("0.02"); // 2%

    private final CartService cartService;
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;
    private final ProductRepository productRepository;
    private final ProductSKURepository productSKURepository;
    private final AddressRepository addressRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Transactional
    public void checkout(OrderRequest orderRequest, HttpServletRequest request, HttpServletResponse response) {
        Long shopId = orderRequest.getShopId();
        List<Long> productIds = orderRequest.getProductIds();
        if (shopId == null || productIds == null || productIds.isEmpty()) {
            throw new RuntimeException("Bạn chưa chọn sản phẩm cuả shop nào.");
        }

        // Lấy giỏ hàng từ cookie
        Cart cart = cartService.getCartFromCookiesToChange(request);

        if (cart.getShops() == null || cart.getShops().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giỏ hàng trống.");
        }

        // Tìm shop tương ứng trong giỏ hàng
        ShopCart shopCart = cart.getShops().stream()
                .filter(shop -> shop.getShopId().equals(shopId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop không tồn tại trong giỏ hàng."));

        // Tìm shop
        Shop shop = getShop(shopId);
        if(shop == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop không tồn tại.");
        if(shop.isClose() || !shop.isActive())  throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop hiện tại đang đóng cửa, vui lòng quay lại sau.");

        // Xác nhận tất cả sản phẩm đều thuộc cùng shop
        if (!shopCart.getShopId().equals(shopId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tất cả sản phẩm phải thuộc cùng một cửa hàng.");
        }

        // Tìm địa chỉ giao hàng
        Address address = getAddress(orderRequest.getAddressId());
        if(address == null) throw new RuntimeException("Không tìm thấy địa chỉ.");

        // Xử lý tạo Order
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (ItemCart item : shopCart.getItems()) {
            if (productIds.contains(item.getProductSKUId())) {
                Optional<ProductSKU> productSKU = productSKURepository.findByIdAndIsDeleteFalse(item.getProductSKUId());
                //kiểm tra exist
                if(!productSKU.isPresent()) throw new RuntimeException("Không tìm thấy phân loại sản phẩm có ID " + item.getProductSKUId());
                ProductSKU proSKU = productSKU.get();
                //check sp cùng 1 shop
                if(!proSKU.getProduct().getShop().getId().equals(shopId)) throw new RuntimeException("Bạn chỉ được đặt đơn hàng trong cùng 1 shop.");
                //check stock
                if (item.getQuantity() > proSKU.getStock()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phân loại "+ proSKU.getSkuCode() +" chỉ còn "+proSKU.getStock()+" sản phẩm.");
                }
                //Check isBulky
//                if(proSKU.isBulky() && !shop.getAddress().getProvinceId().equals(address.getProvinceId())) {
//                    throw new RuntimeException("Rất tiếc, hiện tại chúng tôi chưa thể vận chuyển ngoài tỉnh.");
//                }else if(proSKU.isBulky() && shop.getAddress().getProvinceId().equals(address.getProvinceId())){
//                    orderRequest.setStatus(OrderStatus.FINDINGTRUCK);
//                };

                if(proSKU.isBulky() && orderRequest.getDeliveryMethod().equals(DeliveryMethod.GHN)) {
                    throw new RuntimeException("Rất tiếc, giỏ hàng chứa mặt hàng cồng kềnh, vui lòng chọn phương thức vận chuyển SELF DELIVERY.");
                }else{
                    orderRequest.setStatus(OrderStatus.FINDINGTRUCK);
                };

                totalAmount = totalAmount.add(productSKU.get().getSellingPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
        }
        //update totalAmount
        orderRequest.setTotalAmount(totalAmount.add(orderRequest.getShippingFee()));

        BigDecimal commissionFee = orderRequest.getTotalAmount().multiply(COMMISSION_RATE);
        BigDecimal paymentFee = orderRequest.getTotalAmount().multiply(PAYMENT_GATEWAY_FEE);
        BigDecimal totalFee = commissionFee.add(paymentFee);

        orderRequest.setCommissionFee(commissionFee);
        orderRequest.setPaymentFee(paymentFee);
        orderRequest.setTotalPlatformFee(totalFee);

        // Tạo Order mới
//        Order newOrder = Order.builder()
//                .shop(shop) // Giả sử Shop được tìm bằng ID
//                .status(OrderStatus.PENDING)
//                .totalAmount(totalAmount)
//                .shippingFee(BigDecimal.ZERO) // Không có phí vận chuyển cho đơn giản
//                .paymentMethod(PaymentMethod.COD) // Giả định thanh toán COD
//                .build();
        Order savedOrder = orderService.createOrder(orderRequest);

        // Tạo các OrderDetail từ danh sách sản phẩm
        for (ItemCart item : shopCart.getItems()) {
            if (productIds.contains(item.getProductSKUId())) {
                // Kiểm tra sản phẩm tồn tại
                ProductSKU productSKU = productSKURepository.findByIdAndIsDeleteFalse(item.getProductSKUId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại."));

                // Tạo OrderDetail
                OrderDetail orderDetail = OrderDetail.builder()
                        .id(new OrderDetailId(savedOrder.getId(), item.getProductSKUId()))
                        .order(savedOrder)
                        .productSku(productSKU)
                        .quantity(item.getQuantity())
                        .price(productSKU.getSellingPrice())
                        .build();
                orderDetailService.createOrderDetail(orderDetail);

                // Giảm stock
                productSKU.setStock(productSKU.getStock() - item.getQuantity());
                productSKURepository.save(productSKU);

            }
        }


        // 6. Cập nhật giỏ hàng (xóa các sản phẩm đã đặt hàng)
        productIds.forEach(productId -> cartService.removeFromCart(shopId, productId, request, response));
    }


    private void updateCart(List<Long> productIds){

    }
    private void updateQuantity(){

    }

    private Shop getShop(Long id) {
        return id == null ? null
                : shopRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

    private Address getAddress(Long id) {
        return id == null ? null
                : addressRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}