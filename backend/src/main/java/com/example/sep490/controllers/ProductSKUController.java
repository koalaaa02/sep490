package com.example.sep490.controllers;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.ProductSKURequest;
import com.example.sep490.services.ProductSKUService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/productskus")
public class ProductSKUController {
    private static final Logger logger = LoggerFactory.getLogger(ProductSKUController.class);

    @Autowired
    private ProductSKUService productSKUService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getProductSKUes(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        logger.info("Fetching addresses with pagination, sort, and filter options.");
        return ResponseEntity.ok(productSKUService.getProductSKUs(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getProductSKUById(@PathVariable Long id) {
        logger.info("Fetching address with id: {}", id);
        return ResponseEntity.ok().body(productSKUService.getProductSKUById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> createProductSKU(@Valid @RequestBody ProductSKURequest address) {
        logger.info("Creating new address.");
        return ResponseEntity.ok().body(productSKUService.createProductSKU(address));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> updateProductSKU(@PathVariable Long id,@Valid @RequestBody ProductSKURequest address) {
        logger.info("Updating address with id: {}", id);
        if (!id.equals(address.getId())) {
            return ResponseEntity.badRequest().body("id và id trong phân loại sản phẩm không trùng khớp.");
        }
        return ResponseEntity.ok().body(productSKUService.updateProductSKU(id, address));
    }

    @PostMapping(value = "/{id}/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadFile(@PathVariable Long id,@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok().body(productSKUService.uploadImage(id, file)) ;
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> deleteProductSKU(@PathVariable Long id) {
        logger.info("Deleting address with id: {}", id);
        try {
            productSKUService.deleteProductSKU(id);
            return ResponseEntity.ok().body("Xóa phân loại sản phẩm thành công.");
        } catch (Exception e) {
            logger.error("Error deleting address with id: {}", id, e);
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa phân loại sản phẩm.");
        }
    }
}