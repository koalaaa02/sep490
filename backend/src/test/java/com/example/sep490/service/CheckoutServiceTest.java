//package com.example.sep490.service;
//import com.example.sep490.dto.OrderRequest;
//import com.example.sep490.dto.cart.Cart;
//import com.example.sep490.dto.cart.ItemCart;
//import com.example.sep490.dto.cart.ShopCart;
//import com.example.sep490.entity.*;
//import com.example.sep490.entity.enums.*;
//import com.example.sep490.repository.*;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.*;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.math.BigDecimal;
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class CheckoutServiceTest {
//
//    @InjectMocks
//    private CheckoutService checkoutService;
//
//    @Mock
//    private CartService cartService;
//    @Mock
//    private OrderService orderService;
//    @Mock
//    private OrderDetailService orderDetailService;
//    @Mock
//    private ProductRepository productRepository;
//    @Mock
//    private ProductSKURepository productSKURepository;
//    @Mock
//    private AddressRepository addressRepo;
//    @Mock
//    private ShopRepository shopRepo;
//
//    @Mock
//    private HttpServletRequest request;
//    @Mock
//    private HttpServletResponse response;
//
//    private OrderRequest orderRequest;
//    private Cart cart;
//    private Shop shop;
//    private ShopCart shopCart;
//    private Address address;
//    private Product product;
//    private ProductSKU sku;
//
//    @BeforeEach
//    void setup() {
//        orderRequest = new OrderRequest();
//        orderRequest.setShopId(1L);
//        orderRequest.setProductIds(List.of(10L));
//        orderRequest.setAddressId(1L);
//        orderRequest.setDeliveryMethod(DeliveryMethod.SELF_DELIVERY);
//        orderRequest.setShippingFee(BigDecimal.valueOf(5000));
//
//        ItemCart itemCart = new ItemCart();
//        itemCart.setProductSKUId(10L);
//        itemCart.setQuantity(2);
//
//        shopCart = new ShopCart(1L, "Shop A", List.of(itemCart));
//        cart = new Cart();
//        cart.setShops(List.of(shopCart));
//
//        product = new Product();
//        product.setId(100L);
//        shop = new Shop();
//        shop.setId(1L);
//        shop.setActive(true);
//        shop.setClose(false);
//        product.setShop(shop);
//
//        sku = new ProductSKU();
//        sku.setId(10L);
//        sku.setProduct(product);
//        sku.setStock(10);
//        sku.setSellingPrice(BigDecimal.valueOf(10000));
//        sku.setBulky(false);
//
//        address = new Address();
//        address.setId(1L);
//        address.setProvinceId("01");
//
//        when(shopRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(shop));
//        when(cartService.getCartFromCookies(any())).thenReturn(cart);
//        when(productSKURepository.findByIdAndIsDeleteFalse(10L)).thenReturn(Optional.of(sku));
//        when(addressRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(address));
//        when(orderService.createOrder(any())).thenReturn(new Order()); // mock order return
//    }
//
////    @Test
////    void checkout_Successful() {
////        assertDoesNotThrow(() -> checkoutService.checkout(orderRequest, request, response));
////        verify(orderService).createOrder(any());
////        verify(orderDetailService).createOrderDetail(any());
////        verify(productSKURepository).save(any());
////        verify(cartService).removeFromCart(1L, 10L, request, response);
////    }
//
//    @Test
//    void checkout_Fail_EmptyProductIds() {
//        orderRequest.setProductIds(List.of());
//        RuntimeException ex = assertThrows(RuntimeException.class, () ->
//                checkoutService.checkout(orderRequest, request, response));
//        assertEquals("Bạn chưa chọn sản phẩm cuả shop nào.", ex.getMessage());
//    }
//
//    @Test
//    void checkout_Fail_CartEmpty() {
//        cart.setShops(List.of());
//        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
//                checkoutService.checkout(orderRequest, request, response));
//        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
//    }
//
//    @Test
//    void checkout_Fail_ShopClosed() {
//        shop.setClose(true);
//        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
//                checkoutService.checkout(orderRequest, request, response));
//        assertEquals("Shop hiện tại đang đóng cửa, vui lòng quay lại sau.", ex.getReason());
//    }
//
//    @Test
//    void checkout_Fail_BulkyWithGHN() {
//        sku.setBulky(true);
//        orderRequest.setDeliveryMethod(DeliveryMethod.GHN);
//        RuntimeException ex = assertThrows(RuntimeException.class, () ->
//                checkoutService.checkout(orderRequest, request, response));
//        assertTrue(ex.getMessage().contains("giỏ hàng chứa mặt hàng cồng kềnh"));
//    }
//
//    @Test
//    void checkout_Fail_InsufficientStock() {
//        sku.setStock(1); // insufficient
//        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
//                checkoutService.checkout(orderRequest, request, response));
//        assertTrue(ex.getReason().contains("chỉ còn"));
//    }
//
//    @Test
//    void checkout_Fail_ShopMismatch() {
//        shopCart.setShopId(2L); // mismatch shop
//        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
//                checkoutService.checkout(orderRequest, request, response));
//        assertEquals("Tất cả sản phẩm phải thuộc cùng một cửa hàng.", ex.getReason());
//    }
//
//    @Test
//    void checkout_Fail_AddressNotFound() {
//        when(addressRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.empty());
//        RuntimeException ex = assertThrows(RuntimeException.class, () ->
//                checkoutService.checkout(orderRequest, request, response));
//        assertEquals("Không tìm thấy địa chỉ.", ex.getMessage());
//    }
//
//    @Test
//    void checkout_Fail_SKU_NotFound() {
//        when(productSKURepository.findByIdAndIsDeleteFalse(10L)).thenReturn(Optional.empty());
//        RuntimeException ex = assertThrows(RuntimeException.class, () ->
//                checkoutService.checkout(orderRequest, request, response));
//        assertEquals("Không tìm thấy phân loại sản phẩm có ID 10", ex.getMessage());
//    }
//}
