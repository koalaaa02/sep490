package com.example.sep490.controller;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.publicdto.ChangePasswordRequest;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.mapper.UserMapper;
import com.example.sep490.repository.specifications.InvoiceFilterDTO;
import com.example.sep490.repository.specifications.OrderFilterDTO;
import com.example.sep490.service.InvoiceService;
import com.example.sep490.service.OrderDetailService;
import com.example.sep490.service.OrderService;
import com.example.sep490.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/myprofile")
public class MyProfileController {
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(userService.getUserById(user.getId()));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getMyOrders(OrderFilterDTO filter) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(orderService.getOrdersPublicFilter(filter));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getOrderByIdCustomer(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(orderService.getOrderByIdCustomer(id));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getMyInvoices(InvoiceFilterDTO filter) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(invoiceService.getInvoicesByUserId(filter));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @GetMapping("/invoices/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getInvoiceById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(invoiceService.getInvoiceById(id));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }
//    @PutMapping("/orders/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
//    public ResponseEntity<?> setStatusOrder(@PathVariable Long id, OrderRequest orderRequest) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
//            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
//            return ResponseEntity.ok().body(orderService.updateOrderStatus(id,user.getId(),orderRequest));
//        }
//        return ResponseEntity.badRequest().body("No authenticated user");
//    }

    @GetMapping("/orderdetails/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getMyOrderDetailsByOrderId(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(
                    orderDetailService.getOrderDetailsByOrderId(page, size, sortBy, direction,id)
            );
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        orderService.changeOrderStatusCustomer(id, status);
        return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công!");
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public String changePassword(@RequestBody ChangePasswordRequest request) {
        // Lấy email người dùng từ authentication context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return userService.changePassword(user.getUsername(), request.getOldPassword(), request.getNewPassword(), request.getConfirmNewPassword());
        }
        throw new RuntimeException("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
    }
}
