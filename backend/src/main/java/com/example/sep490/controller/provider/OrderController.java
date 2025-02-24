package com.example.sep490.controller.provider;

import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.repository.specifications.OrderFilterDTO;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;
import com.example.sep490.dto.OrderRequest;
import com.example.sep490.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Validated
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_PROVIDER', 'ROLE_DEALER')")
    public ResponseEntity<?> getOrders(@Valid OrderFilterDTO filter) {
        return ResponseEntity.ok(orderService.getOrdersFilter(filter));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_PROVIDER', 'ROLE_DEALER')")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok().body(orderService.getOrderById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_PROVIDER')")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest order) {
        return ResponseEntity.ok().body(orderService.createOrder(order));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_PROVIDER')")
    public ResponseEntity<?> updateOrder(@PathVariable Long id,@Valid @RequestBody OrderRequest order) {
        if (!id.equals(order.getId())) {
            return ResponseEntity.badRequest().body("id và id trong đơn hàng không trùng khớp.");
        }
        return ResponseEntity.ok().body(orderService.updateOrder(id, order));
    }

    @PutMapping("/status")
    @PreAuthorize("hasAnyAuthority('ROLE_PROVIDER')")
    public ResponseEntity<String> updateOrderStatus(
            @RequestBody List<Long> ids,
            @RequestBody OrderStatus status) {

        orderService.changeStatusOrders(ids, status);
        return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công!");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_PROVIDER')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok().body("Xóa đơn hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa đơn hàng.");
        }
    }
}