package com.example.sep490.adapter;

import com.example.sep490.dto.publicdto.PaymentResponse;
import com.example.sep490.dto.publicdto.PaymentResultResponse;
import com.example.sep490.entity.enums.PaymentType;
import com.example.sep490.factory.PaymentStrategyFactory;
import com.example.sep490.strategy.PaymentStrategy;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VNPayAdapter implements PaymentMethod {
    @Autowired
    private PaymentStrategyFactory paymentStrategyFactory;

    @Override
    public PaymentResponse pay(HttpServletRequest request, PaymentType paymentType, String bankCode, long amount, Long referenceId) {
        PaymentStrategy strategy = paymentStrategyFactory.getPaymentStrategy(paymentType);
        PaymentResponse response = strategy.processPayment(request, amount, bankCode, referenceId);
        return response;
    }

    @Override
    public PaymentResultResponse handleWebHook(HttpServletRequest request) {
        String paymentType = request.getParameter("vnp_OrderInfo").split("_")[0];
        PaymentStrategy strategy = paymentStrategyFactory.getPaymentStrategy(PaymentType.valueOf(paymentType));
        return strategy.handleWebHook(request);
    }
}
