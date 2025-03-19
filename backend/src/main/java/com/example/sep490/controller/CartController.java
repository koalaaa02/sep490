package com.example.sep490.controller;

import com.example.sep490.dto.cart.Cart;
import com.example.sep490.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Endpoint: Lấy giỏ hàng
     * Method: GET
     */
    @GetMapping
    public ResponseEntity<Cart> getCart(HttpServletRequest request) {
        Cart cart = cartService.getCartFromCookies(request);
        return ResponseEntity.ok(cart);
    }

    /**
     * Endpoint: Thêm sản phẩm vào giỏ hàng
     * Method: POST
     */
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestParam Long shopId,
            @RequestParam Long productSKUId,
            @RequestParam int quantity,
            HttpServletRequest request,
            HttpServletResponse response) {
        cartService.addToCart(shopId, productSKUId, quantity, request, response);
        return ResponseEntity.ok("Thêm vào giỏ hàng thành công.");
    }

    /**
     * Endpoint: Cập nhật số lượng sản phẩm trong giỏ hàng
     * Method: PUT
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateCart(
            @RequestParam Long shopId,
            @RequestParam Long productSKUId,
            @RequestParam int quantity,
            HttpServletRequest request,
            HttpServletResponse response) {
        cartService.updateCart(shopId, productSKUId, quantity, request, response);
        return ResponseEntity.ok("Cập nhật giỏ hàng thành công.");
    }

    /**
     * Endpoint: Xóa sản phẩm khỏi giỏ hàng
     * Method: DELETE
     */
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(
            @RequestParam Long shopId,
            @RequestParam Long productSKUId,
            HttpServletRequest request,
            HttpServletResponse response) {
        cartService.removeFromCart(shopId, productSKUId, request, response);
        return ResponseEntity.ok("Xóa sản phẩm khỏi giỏ hàng thành công.");
    }
}