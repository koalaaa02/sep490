package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entities.Order;
import com.example.sep490.entities.enums.PaymentMethod;
import com.example.sep490.entities.enums.TransactionStatus;
import com.example.sep490.entities.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {
	private Long id;

    @JsonIgnoreProperties({ "transaction","orderDetails","address", "shop"})
    private Order order;

    private PaymentMethod method; // CARD, COD
    
    private String transactionId; // Mã giao dịch từ VNPAY/...

    private BigDecimal amount;  // số tiền
    
    private String message; //nội dung chuyển khoản

    private LocalDateTime paymentDate = LocalDateTime.now();

    private TransactionType transactionType;

    private TransactionStatus status;
}
