package com.example.sep490.services;

import com.example.sep490.controllers.CategoryController;
import com.example.sep490.dto.cart.Cart;
import com.example.sep490.dto.cart.ItemCart;
import com.example.sep490.dto.cart.ShopCart;
import com.example.sep490.repositories.ProductSKURepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final String CART_COOKIE_NAME = "cart";
    private static final int COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 1 tuần
    private final ObjectMapper objectMapper;
    private final ProductSKUService productSKUService; // Giả sử ProductService đã được triển khai trước đó
    private final ProductSKURepository productSKURepository;

    private static final Logger logger = LoggerFactory.getLogger(Cart.class);


    // Thêm sản phẩm vào giỏ hàng
    public void addToCart(Long shopId, Long productSKUId, int quantity, HttpServletRequest request, HttpServletResponse response) {
        Cart cart = getCartFromCookies(request);

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
                .orElse(new ItemCart(null, productSKUId, "Product Name", "SKU Code", "Image URL", null, 0));

        itemCart.setQuantity(itemCart.getQuantity() + quantity);

        // Cập nhật vào danh sách nếu sản phẩm mới
        if (!shopCart.getItems().contains(itemCart)) {
            shopCart.getItems().add(itemCart);
        }

        saveCartToCookies(cart, response);
    }

    // Sửa sản phẩm trong giỏ hàng
    public void updateCart(Long shopId, Long productSKUId, int quantity, HttpServletRequest request, HttpServletResponse response) {
        Cart cart = getCartFromCookies(request);

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found in cart"));

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
                    return objectMapper.readValue(cartJson, Cart.class);
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
            logger.info(cartJson);
            response.addCookie(cookie);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}