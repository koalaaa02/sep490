package com.example.sep490.service;

import com.example.sep490.dto.cart.Cart;
import com.example.sep490.dto.cart.ItemCart;
import com.example.sep490.dto.cart.ShopCart;
import com.example.sep490.entity.ProductSKU;
import com.example.sep490.mapper.ProductSKUMapper;
import com.example.sep490.repository.ProductSKURepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final String CART_COOKIE_NAME = "cart";
    private static final int COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 1 tuần
    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final ProductSKURepository productSKURepository;
    private final ProductSKUMapper productSKUMapper;
    private static final Logger logger = LoggerFactory.getLogger(Cart.class);


    // Thêm sản phẩm vào giỏ hàng
    public void addToCart(Long shopId, Long productSKUId, int quantity, HttpServletRequest request, HttpServletResponse response) {
        Cart cart = getCartFromCookiesToChange(request);

        //Lấy thông tin sp từ db
        ProductSKU proSKU = productSKURepository.findById(productSKUId).orElse(null);
        if(proSKU == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Phân loại sản phẩm này không tồn tại.");
        //check product
        if(proSKU.getProduct() != null && !proSKU.getProduct().isActive()) throw new RuntimeException("Sản phẩm này hiện tạm khóa.");
        if(proSKU.getProduct() != null && proSKU.getProduct().isDelete()) throw new RuntimeException("Sản phẩm này hiện không tồn tại.");

        // Kiểm tra số lượng còn lại của sản phẩm
        int availableQuantity = productSKURepository.getAvailableQuantity(productSKUId);
        if (quantity > availableQuantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested quantity exceeds available stock");
        }

        if (cart.getShops() == null) {
            cart.setShops(new ArrayList<>());
        }

        // Xử lý thêm sản phẩm vào shop tương ứng
        ShopCart shopCart = cart.getShops().stream()
                .filter(shop -> shop.getShopId().equals(shopId))
                .findFirst()
                .orElseGet(() -> {
                    ShopCart newShop = new ShopCart(shopId, "Shop Name", new java.util.ArrayList<>());
                    cart.getShops().add(newShop);
                    return newShop;
                });

        // Tìm sản phẩm trong giỏ hàng của shop
        ItemCart itemCart = shopCart.getItems().stream()
                .filter(item -> item.getProductSKUId().equals(productSKUId))
                .findFirst()
                .orElse(
                        new ItemCart(proSKU.getProduct().getId(),
                                productSKUId, proSKU.getProduct().getName(),
                                proSKU.getSkuCode(),
                                proSKU.getImages(),
                                proSKU.getSellingPrice(),
                                0,
                                null));

        itemCart.setQuantity(itemCart.getQuantity() + quantity);
        // Cập nhật vào danh sách nếu sản phẩm mới
        if (!shopCart.getItems().contains(itemCart)) {
            shopCart.getItems().add(itemCart);
        }
        saveCartToCookies(cart, response);
    }

    // Sửa sản phẩm trong giỏ hàng
    public void updateCart(Long shopId, Long productSKUId, int quantity, HttpServletRequest request, HttpServletResponse response) {
        Cart cart = getCartFromCookiesToChange(request);

        // Kiểm tra số lượng còn lại của sản phẩm
        int availableQuantity = productSKURepository.getAvailableQuantity(productSKUId);
        if (quantity > availableQuantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested quantity exceeds available stock");
        }

        // Tìm shop và sản phẩm trong giỏ hàng
        ShopCart shopCart = cart.getShops().stream()
                .filter(shop -> shop.getShopId().equals(shopId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found in cart"));

        ItemCart itemCart = shopCart.getItems().stream()
                .filter(item -> item.getProductSKUId().equals(productSKUId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found in cart"));

        // Cập nhật số lượng
        itemCart.setQuantity(quantity);

        saveCartToCookies(cart, response);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public void removeFromCart(Long shopId, Long productSKUId, HttpServletRequest request, HttpServletResponse response) {
        Cart cart = getCartFromCookies(request);

        // Tìm shop trong giỏ hàng
        ShopCart shopCart = cart.getShops().stream()
                .filter(shop -> shop.getShopId().equals(shopId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy shop trong giỏ hàng"));

        // Loại bỏ sản phẩm khỏi danh sách
        shopCart.getItems().removeIf(item -> item.getProductSKUId().equals(productSKUId));

        // Xóa shop nếu không còn sản phẩm
        if (shopCart.getItems().isEmpty()) {
            cart.getShops().remove(shopCart);
        }

        saveCartToCookies(cart, response);
    }


    // Lấy giỏ hàng từ cookie
    public Cart getCartFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            Optional<Cookie> cartCookie =
                    java.util.Arrays.stream(cookies).filter(cookie -> CART_COOKIE_NAME.equals(cookie.getName())).findFirst();
            if (cartCookie.isPresent()) {
                try {
                    String cartJson = decodeCartData(cartCookie.get().getValue());
                    Cart cart = objectMapper.readValue(cartJson, Cart.class);
                    // sau khi deserialize, lấy tất cả SKUId để load 1 lần
                    List<Long> skuIds = cart.getShops().stream()
                            .flatMap(shop -> shop.getItems().stream())
                            .map(ItemCart::getProductSKUId)
                            .distinct()
                            .toList();

                    Map<Long, ProductSKU> skuMap = productSKURepository.findAllById(skuIds).stream()
                            .collect(Collectors.toMap(ProductSKU::getId, Function.identity()));

                    // Gán DTO vào từng item
                    for (ShopCart shop : cart.getShops()) {
                        for (ItemCart item : shop.getItems()) {
                            ProductSKU sku = skuMap.get(item.getProductSKUId());
                            if (sku != null) {
                                item.setProductSKUResponse(productSKUMapper.EntityToResponse(sku));
                            }
                        }
                    }
                    return cart;
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart cookie is invalid");
                }
            }
        }
        return new Cart(); // Trả về giỏ hàng trống nếu không có cookie
    }

    public Cart getCartFromCookiesToChange(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            Optional<Cookie> cartCookie =
                    java.util.Arrays.stream(cookies).filter(cookie -> CART_COOKIE_NAME.equals(cookie.getName())).findFirst();
            if (cartCookie.isPresent()) {
                try {
                    String cartJson = decodeCartData(cartCookie.get().getValue());
                    Cart cart = objectMapper.readValue(cartJson, Cart.class);
                    return cart;
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart cookie is invalid");
                }
            }
        }
        return new Cart(); // Trả về giỏ hàng trống nếu không có cookie
    }

    public String encodeCartData(String json) {
        return Base64.getEncoder().encodeToString(json.getBytes());
    }

    public String decodeCartData(String encoded) {
        return new String(Base64.getDecoder().decode(encoded));
    }

    // Lưu giỏ hàng vào cookie
    private void saveCartToCookies(Cart cart, HttpServletResponse response) {
        try {
            String cartJson = encodeCartData(objectMapper.writeValueAsString(cart));
            Cookie cookie = new Cookie(CART_COOKIE_NAME, cartJson);
            cookie.setMaxAge(COOKIE_MAX_AGE);
            cookie.setPath("/");
            cookie.setSecure(true);  // Bắt buộc nếu SameSite=None
            cookie.setHttpOnly(false); // Ngăn JavaScript truy cập cookie

            response.addCookie(cookie);
            String cookieHeader = String.format("%s=%s; Path=%s; Max-Age=%d; Secure; SameSite=None",
                    CART_COOKIE_NAME, cartJson, "/", COOKIE_MAX_AGE);
            response.addHeader("Set-Cookie", cookieHeader);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
    // private void saveCartToCookies(Cart cart, HttpServletResponse response) {
    //     try {
    //         String cartJson = encodeCartData(objectMapper.writeValueAsString(cart));
    //         Cookie cookie = new Cookie(CART_COOKIE_NAME, cartJson);
    //         cookie.setMaxAge(COOKIE_MAX_AGE);
    //         cookie.setPath("/");
    //         logger.info(cartJson);
    //         response.addCookie(cookie);
    //     } catch (Exception e) {
    //         throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    //     }
    // }
}