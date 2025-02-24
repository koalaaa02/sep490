package com.example.sep490.controller;

import com.example.sep490.dto.OrderRequest;
import com.example.sep490.service.CheckoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    /**
     * Handles the checkout process.
     *
     * @param orderRequest The order details provided by the client.
     * @param request      The HTTP servlet request to retrieve cookies or session info.
     * @param response     The HTTP servlet response to update cookies or headers.
     * @return ResponseEntity indicating the success or failure of the checkout process.
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_DEALER')")
    public ResponseEntity<String> checkout(
            @RequestBody OrderRequest orderRequest,
            HttpServletRequest request,
            HttpServletResponse response) {

        try {
            checkoutService.checkout(orderRequest, request, response);
            return ResponseEntity.ok("Checkout successful.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Checkout failed: " + ex.getMessage());
        }
    }
}