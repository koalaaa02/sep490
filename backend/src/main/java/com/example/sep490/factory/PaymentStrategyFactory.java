package com.example.sep490.factory;

import com.example.sep490.entities.enums.PaymentType;
import com.example.sep490.entities.enums.TransactionType;
import com.example.sep490.services.payment.InvoicePaymentStrategy;
import com.example.sep490.services.payment.OrderPaymentStrategy;
import com.example.sep490.services.payment.PlatformFeePaymentStrategy;
import com.example.sep490.strategy.PaymentStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentStrategyFactory {
    private final OrderPaymentStrategy orderPaymentStrategy;
    private final PlatformFeePaymentStrategy platformFeePaymentStrategy;
    private final InvoicePaymentStrategy invoicePaymentStrategy;

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

