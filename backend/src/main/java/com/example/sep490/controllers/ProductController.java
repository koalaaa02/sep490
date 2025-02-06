package com.example.sep490.controllers;


import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.AuthRequest;
import com.example.sep490.dto.ProductDTO;
import com.example.sep490.dto.ProductRequest;
import com.example.sep490.entities.Product;
import com.example.sep490.services.JwtService;
import com.example.sep490.services.ProductService;
import com.example.sep490.services.UserService;
import com.example.sep490.strategy.ProductStrategy;
import com.example.sep490.utils.PageResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/private/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private List<ProductStrategy> strategies;
    
    @GetMapping("/")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> getProductsSeller(Authentication authentication) {
    	String role = authentication.getAuthorities().toString();
        for (ProductStrategy strategy : strategies) {
            if (strategy.supports(role)) {
                return ResponseEntity.ok(strategy.getAllProducts());
            }
        }
        return ResponseEntity.badRequest().body("bad request");
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> getProductsSellerById(@PathVariable Long id, Authentication authentication) {
    	String role = authentication.getAuthorities().toString();
        for (ProductStrategy strategy : strategies) {
            if (strategy.supports(role)) {
                return ResponseEntity.ok(strategy.getProductById(id));
            }
        }
        return ResponseEntity.badRequest().body("bad request");
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest product) {
    	String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
        for (ProductStrategy strategy : strategies) {
            if (strategy.supports(role)) {
                return ResponseEntity.ok(strategy.createProduct(product));
            }
        }
        return ResponseEntity.badRequest().body("Lỗi trong quá trình tạo sản phẩm.");
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, ProductRequest productDetails) {
    	try {
    		String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
            for (ProductStrategy strategy : strategies) {
                if (strategy.supports(role)) {
                    return ResponseEntity.ok(strategy.updateProduct(id, productDetails));
                }
            }
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.badRequest().body("Lỗi trong quá trình sửa sản phẩm.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
    	String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
        for (ProductStrategy strategy : strategies) {
            if (strategy.supports(role)) {
            	strategy.deleteProduct(id);
                return ResponseEntity.ok("Xóa thành công.");
            }
        }
//        return ResponseEntity.noContent().build();
        return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa sản phẩm.");
    }
}
//
//@GetMapping("/")
//@PreAuthorize("permitAll()") // Cho phép anonymous truy cập
//public ResponseEntity<?> getProducts(Authentication authentication) {
//	String role = authentication.getAuthorities().toString();
//
//    for (ProductStrategy strategy : strategies) {
//        if (strategy.supports(role)) {
//            return ResponseEntity.ok(strategy.processOrder(1535L));
//        }
//    }
//    return ResponseEntity.badRequest().body("abc");
//}