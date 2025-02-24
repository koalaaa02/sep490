package com.example.sep490.factory;

import com.example.sep490.entity.enums.PaymentType;

import com.example.sep490.strategy.InvoicePaymentStrategy;
import com.example.sep490.strategy.OrderPaymentStrategy;
import com.example.sep490.strategy.PaymentStrategy;
import com.example.sep490.strategy.PlatformFeePaymentStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentStrategyFactory {
    @Autowired
    private OrderPaymentStrategy orderPaymentStrategy;
    @Autowired
    private PlatformFeePaymentStrategy platformFeePaymentStrategy;
    @Autowired
    private InvoicePaymentStrategy invoicePaymentStrategy;

    public PaymentStrategy getPaymentStrategy(PaymentType type) {
        switch (type) {
            case ORDER:
                return orderPaymentStrategy;
            case INVOICE:
                return invoicePaymentStrategy;
            case PLATFORM_FEE:
                return platformFeePaymentStrategy;
            default:
                throw new IllegalArgumentException("Loại thanh toán không hợp lệ");
        }
    }
}

