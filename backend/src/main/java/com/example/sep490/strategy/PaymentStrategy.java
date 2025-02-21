package com.example.sep490.strategy;

import com.example.sep490.dto.publicdto.PaymentResultResponse;
import com.example.sep490.dto.publicdto.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentStrategy {
    PaymentResponse processPayment(HttpServletRequest request, long amount, String bankCode, Long referenceId);
    PaymentResultResponse handleWebHook(HttpServletRequest request);

}

