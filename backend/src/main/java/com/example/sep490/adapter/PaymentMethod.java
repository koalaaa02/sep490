package com.example.sep490.adapter;

import com.example.sep490.dto.publicdto.PaymentResponse;
import com.example.sep490.dto.publicdto.PaymentResultResponse;
import com.example.sep490.entity.enums.PaymentType;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentMethod {
    PaymentResponse pay(HttpServletRequest request, PaymentType paymentType,  String bankCode, long amount, Long referenceId);
    PaymentResultResponse handleWebHook(HttpServletRequest request);
}
