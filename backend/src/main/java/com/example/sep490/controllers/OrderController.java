package com.example.sep490.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.sep490.dto.OrderRequest;
import com.example.sep490.services.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_USER')")
    public ResponseEntity<?> getOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        return ResponseEntity.ok(orderService.getOrders(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_USER')")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok().body(orderService.getOrderById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest order) {
        return ResponseEntity.ok().body(orderService.createOrder(order));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody OrderRequest order) {
        if (!id.equals(order.getId())) {
            return ResponseEntity.badRequest().body("id và id trong đơn hàng không trùng khớp.");
        }
        return ResponseEntity.ok().body(orderService.updateOrder(id, order));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok().body("Xóa đơn hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa đơn hàng.");
        }
    }
}