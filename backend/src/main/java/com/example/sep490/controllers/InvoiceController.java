package com.example.sep490.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.InvoiceRequest;
import com.example.sep490.services.InvoiceService;

import java.util.Objects;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private static final Logger logger = LoggerFactory.getLogger(InvoiceController.class);

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> getInvoices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        logger.info("Fetching invoices with pagination and filters");
        return ResponseEntity.ok(invoiceService.getInvoices(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> getInvoiceById(@PathVariable Long id) {
        logger.info("Fetching invoice with id: {}", id);
        return ResponseEntity.ok().body(invoiceService.getInvoiceById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> createInvoice(@RequestBody InvoiceRequest invoice) {
        logger.info("Creating a new invoice");
        return ResponseEntity.ok().body(invoiceService.createInvoice(invoice));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> updateInvoice(@PathVariable Long id, @RequestBody InvoiceRequest invoice) {
        logger.info("Updating invoice with id: {}", id);
        if (!Objects.equals(id, invoice.getId())) {
            return ResponseEntity.badRequest().body("ID trong URL và ID trong hóa đơn không trùng khớp.");
        }
        return ResponseEntity.ok().body(invoiceService.updateInvoice(id, invoice));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        logger.info("Deleting invoice with id: {}", id);
        try {
            invoiceService.deleteInvoice(id);
            return ResponseEntity.ok().body("Xóa hóa đơn thành công.");
        } catch (Exception e) {
            logger.error("Error occurred while deleting invoice with id: {}", id, e);
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa hóa đơn.");
        }
    }
}