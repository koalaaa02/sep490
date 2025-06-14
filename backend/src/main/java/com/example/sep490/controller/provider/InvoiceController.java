package com.example.sep490.controller.provider;

import com.example.sep490.repository.specifications.FilterDTO;
import com.example.sep490.repository.specifications.InvoiceFilterDTO;
import com.example.sep490.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.InvoiceRequest;
import com.example.sep490.service.InvoiceService;

import java.util.Objects;

@RestController
@RequestMapping("/api/provider/invoices")
public class InvoiceController {
    private static final Logger logger = LoggerFactory.getLogger(InvoiceController.class);

    @Autowired
    private InvoiceService invoiceService;

//    @GetMapping("/")
//    public ResponseEntity<?> getInvoices(@Valid InvoiceFilterDTO filter) {
//        logger.info("Fetching invoices with pagination and filters");
//        return ResponseEntity.ok(invoiceService.getInvoices(filter));
//    }

    @GetMapping("/UserInvoiceSummary")
    public ResponseEntity<?> getUserInvoiceSummary(FilterDTO filter) {
        return ResponseEntity.ok(invoiceService.getUsersWithInvoicesCreatedBy(filter));
    }

    @GetMapping("/GetAllByDealerId/{id}")
    public ResponseEntity<?> GetAllByDealerId(@Valid InvoiceFilterDTO filter ,@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoicesByDealerId(filter, id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInvoiceById(@PathVariable Long id) {
        logger.info("Fetching invoice with id: {}", id);
        return ResponseEntity.ok().body(invoiceService.getInvoiceById(id));
    }

    @PostMapping
    public ResponseEntity<?> createInvoice(@Valid @RequestBody InvoiceRequest invoice) {
        logger.info("Creating a new invoice");
        return ResponseEntity.ok().body(invoiceService.createInvoice(invoice));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvoice(@PathVariable Long id,@Valid @RequestBody InvoiceRequest invoice) {
        logger.info("Updating invoice with id: {}", id);
        if (!Objects.equals(id, invoice.getId())) {
            return ResponseEntity.badRequest().body("ID trong URL và ID trong hóa đơn không trùng khớp.");
        }
        return ResponseEntity.ok().body(invoiceService.updateInvoice(id, invoice));
    }

    @DeleteMapping("/{id}")
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