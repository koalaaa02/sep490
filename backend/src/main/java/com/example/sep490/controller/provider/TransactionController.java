package com.example.sep490.controller.provider;

import com.example.sep490.repository.specifications.TransactionFilterDTO;
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

import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> getTransactions(@Valid TransactionFilterDTO filter) {
        return ResponseEntity.ok(transactionService.getTransactions(filter));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok().body(transactionService.getTransactionById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest transaction) {
        return ResponseEntity.ok().body(transactionService.createTransaction(transaction));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id,@Valid @RequestBody TransactionRequest transaction) {
        if (!id.equals(transaction.getId())) {
            return ResponseEntity.badRequest().body("Id và id trong giao dịch không trùng khớp.");
        }
        return ResponseEntity.ok().body(transactionService.updateTransaction(id, transaction));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok().body("Xóa giao dịch thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa giao dịch.");
        }
    }
}