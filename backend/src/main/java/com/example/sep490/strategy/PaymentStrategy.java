package com.example.sep490.strategy;

import com.example.sep490.dto.publicdto.PaymentResultDTO;
import com.example.sep490.dto.publicdto.VNPayResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentStrategy {
    VNPayResponse processPayment(HttpServletRequest request, long amount, String bankCode, Long referenceId);
    PaymentResultDTO handleVnPayPayment(HttpServletRequest request);

}

