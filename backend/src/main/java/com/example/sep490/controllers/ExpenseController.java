package com.example.sep490.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.ExpenseRequest;
import com.example.sep490.services.ExpenseService;

import java.util.Objects;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> getExpenses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        logger.info("Fetching expenses with pagination and filters");
        return ResponseEntity.ok(expenseService.getExpenses(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id) {
        logger.info("Fetching expense with id: {}", id);
        return ResponseEntity.ok().body(expenseService.getExpenseById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> createExpense(@RequestBody ExpenseRequest expense) {
        logger.info("Creating a new expense");
        return ResponseEntity.ok().body(expenseService.createExpense(expense));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequest expense) {
        logger.info("Updating expense with id: {}", id);
        if (!Objects.equals(id, expense.getId())) {
            return ResponseEntity.badRequest().body("ID trong URL và ID trong hóa đơn không trùng khớp.");
        }
        return ResponseEntity.ok().body(expenseService.updateExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        logger.info("Deleting expense with id: {}", id);
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.ok().body("Xóa hóa đơn thành công.");
        } catch (Exception e) {
            logger.error("Error occurred while deleting expense with id: {}", id, e);
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa hóa đơn.");
        }
    }
}