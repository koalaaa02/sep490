package com.example.sep490.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.sep490.dto.DebtPaymentRequest;
import com.example.sep490.services.DebtPaymentService;

@RestController
@RequestMapping("/api/debt-payments")
public class DebtPaymentController {

    @Autowired
    private DebtPaymentService debtPaymentService;

    @PostMapping
    public ResponseEntity<?> createDebtPayment(@RequestBody DebtPaymentRequest debtPaymentRequest) {
        return ResponseEntity.ok(debtPaymentService.createDebtPayment(debtPaymentRequest));
    }
}
