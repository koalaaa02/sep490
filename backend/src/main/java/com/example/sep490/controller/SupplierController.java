package com.example.sep490.controller;

import com.example.sep490.repository.specifications.SupplierFilterDTO;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sep490.dto.SupplierRequest;
import com.example.sep490.service.SupplierService;

@RestController
@RequestMapping("/api/suppliers")
@Validated
public class SupplierController {
    private static final Logger logger = LoggerFactory.getLogger(SupplierController.class);

    @Autowired
    private SupplierService supplierService;

    @GetMapping("/")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> getSuppliers(@Valid SupplierFilterDTO filter) {
        logger.info("Fetching suppliers with filters");
        return ResponseEntity.ok(supplierService.getSuppliers(filter));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> getSupplierById(@PathVariable Long id) {
        logger.info("Fetching supplier with id: {}", id);
        return ResponseEntity.ok().body(supplierService.getSupplierById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> createSupplier(@Valid @RequestBody SupplierRequest supplier) {
        logger.info("Creating new supplier: {}", supplier);
        return ResponseEntity.ok().body(supplierService.createSupplier(supplier));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id,@Valid @RequestBody SupplierRequest supplier) {
        logger.info("Updating supplier with id: {}", id);
        if (!id.equals(supplier.getId())) {
            return ResponseEntity.badRequest().body("id và id trong nhà cung cấp không trùng khớp.");
        }
        return ResponseEntity.ok().body(supplierService.updateSupplier(id, supplier));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        logger.info("Deleting supplier with id: {}", id);
        try {
            supplierService.deleteSupplier(id);
            return ResponseEntity.ok().body("Xóa nhà cung cấp thành công.");
        } catch (Exception e) {
            logger.error("Error deleting supplier with id {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa nhà cung cấp.");
        }
    }
}