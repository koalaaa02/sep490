package com.example.sep490.controllers;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.DebtPaymentRequest;
import com.example.sep490.services.DebtPaymentService;

@RestController
@RequestMapping("/api/debt-payments")
public class DebtPaymentController {
    private static final Logger logger = LoggerFactory.getLogger(DebtPaymentController.class);

    @Autowired
    private DebtPaymentService debtPaymentService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER','ROLE_CUSTOMER')")
    public ResponseEntity<?> getDebtPayments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        logger.info("Fetching debt payments with filters - page: {}, size: {}, sortBy: {}, direction: {}",
                page, size, sortBy, direction);
        return ResponseEntity.ok(debtPaymentService.getDebtPayments(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER','ROLE_CUSTOMER')")
    public ResponseEntity<?> getDebtPaymentById(@PathVariable Long id) {
        logger.info("Fetching debt payment with id: {}", id);
        return ResponseEntity.ok().body(debtPaymentService.getDebtPaymentById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER','ROLE_CUSTOMER')")
    public ResponseEntity<?> createDebtPayment(@Valid @RequestBody DebtPaymentRequest debtPaymentRequest) {
        logger.info("Creating new debt payment: {}", debtPaymentRequest);
        return ResponseEntity.ok().body(debtPaymentService.createDebtPayment(debtPaymentRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER','ROLE_CUSTOMER')")
    public ResponseEntity<?> updateDebtPayment(@PathVariable Long id,@Valid @RequestBody DebtPaymentRequest debtPaymentRequest) {
        logger.info("Updating debt payment with id: {}", id);
        if (!id.equals(debtPaymentRequest.getId())) {
            return ResponseEntity.badRequest().body("ID trong URL và trong nội dung không khớp.");
        }
        return ResponseEntity.ok().body(debtPaymentService.updateDebtPayment(id, debtPaymentRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER','ROLE_CUSTOMER')")
    public ResponseEntity<?> deleteDebtPayment(@PathVariable Long id) {
        logger.info("Deleting debt payment with id: {}", id);
        try {
            debtPaymentService.deleteDebtPayment(id);
            return ResponseEntity.ok().body("Xóa thanh toán nợ thành công.");
        } catch (Exception e) {
            logger.error("Error while deleting debt payment with id: {}", id, e);
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa thanh toán nợ.");
        }
    }
}