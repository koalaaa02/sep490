package com.example.sep490.controller;

import com.example.sep490.dto.BankAccountRequest;
import com.example.sep490.repository.specifications.BankAccountFilterDTO;
import com.example.sep490.service.BankAccountService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bankaccounts")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER', 'ROLE_DEALER')")
public class BankAccountController {
    private static final Logger logger = LoggerFactory.getLogger(BankAccountController.class);

    @Autowired
    private BankAccountService bankAccountService;

    @GetMapping("/")
    public ResponseEntity<?> getBankAccount(@Valid BankAccountFilterDTO filter) {
        logger.info("Fetching bankAccount with pagination, sort, and filter options.");
        return ResponseEntity.ok(bankAccountService.getBankAccounts(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBankAccountById(@PathVariable Long id) {
        logger.info("Fetching bankAccount with id: {}", id);
        return ResponseEntity.ok().body(bankAccountService.getBankAccountById(id));
    }

    @PostMapping
    public ResponseEntity<?> createBankAccount(@Valid @RequestBody BankAccountRequest bankAccount) {
        logger.info("Creating new bankAccount.");
        return ResponseEntity.ok().body(bankAccountService.createBankAccount(bankAccount));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBankAccount(@PathVariable Long id,@Valid @RequestBody BankAccountRequest bankAccount) {
        logger.info("Updating bankAccount with id: {}", id);
        if (!id.equals(bankAccount.getId())) {
            return ResponseEntity.badRequest().body("id và id trong tài khoản không trùng khớp.");
        }
        return ResponseEntity.ok().body(bankAccountService.updateBankAccount(id, bankAccount));
    }

    @PutMapping("/setdefault/{id}")
    public ResponseEntity<?> setDefaultBankAccount(@PathVariable Long id) {
        logger.info("Updating bankAccount with id: {}", id);
        bankAccountService.setDefaultBankAccount(id);
        return ResponseEntity.ok().body("Thay đổi tài khoản mặc định thành công.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBankAccount(@PathVariable Long id) {
        logger.info("Deleting bankAccount with id: {}", id);
        try {
            bankAccountService.deleteBankAccount(id);
            return ResponseEntity.ok().body("Xóa tài khoản thành công.");
        } catch (Exception e) {
            logger.error("Error deleting bankAccount with id: {}", id, e);
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa tài khoản.");
        }
    }
}