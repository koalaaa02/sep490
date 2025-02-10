package com.example.sep490.controllers;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.mapper.UserMapper;
import com.example.sep490.services.OrderService;
import com.example.sep490.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/myprofile")
public class MyProfile {
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private UserMapper userMapper;

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
    public ResponseEntity<?> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(orderService.getOrdersByCreatedBy(user.getId()));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }
}
