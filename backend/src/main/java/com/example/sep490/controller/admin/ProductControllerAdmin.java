package com.example.sep490.controller.admin;

import com.example.sep490.repository.specifications.ProductFilterDTO;
import com.example.sep490.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
public class ProductControllerAdmin {

    @Autowired
    private ProductService productService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getProducts(@Valid ProductFilterDTO filter) {
        return ResponseEntity.ok(productService.getProductsByFilter(filter));
    }

    @PutMapping("/activate/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> activateProduct(@PathVariable Long id) {
        try {
            productService.activateProduct(id);
            return ResponseEntity.ok().body("Kích hoạt sản phẩm thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình kích hoạt sản phẩm.");
        }
    }
}
