package com.example.sep490.controller.admin;

import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.repository.specifications.TransactionFilterDTO;
import com.example.sep490.service.TransactionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/transactions")
public class TransactionControllerAdmin {
    private static final Logger logger = LoggerFactory.getLogger(TransactionControllerAdmin.class);

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/")
    public ResponseEntity<?> getTransactions(@Valid TransactionFilterDTO filter) {
        return ResponseEntity.ok(transactionService.getTransactionsAdmin(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok().body(transactionService.getTransactionById(id));
    }

//    @PostMapping
//    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest transaction) {
//        return ResponseEntity.ok().body(transactionService.createTransaction(transaction));
//    }

//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateTransaction(@PathVariable Long id,@Valid @RequestBody TransactionRequest transaction) {
//        if (!id.equals(transaction.getId())) {
//            return ResponseEntity.badRequest().body("Id và id trong giao dịch không trùng khớp.");
//        }
//        return ResponseEntity.ok().body(transactionService.updateTransaction(id, transaction));
//    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
//        try {
//            transactionService.deleteTransaction(id);
//            return ResponseEntity.ok().body("Xóa giao dịch thành công.");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa giao dịch.");
//        }
//    }
}