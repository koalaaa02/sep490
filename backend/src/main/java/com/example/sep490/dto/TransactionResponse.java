package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entity.Auditable;
import com.example.sep490.entity.DebtPayment;
import com.example.sep490.entity.Order;
import com.example.sep490.entity.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse{
	private Long id;

    @JsonIgnoreProperties({ "orderDetails", "transaction", "invoice","address","shop"})
    private Order order;
    @JsonIgnoreProperties({ "transaction","invoice"})
    private DebtPayment debtPayment;
    private String transactionId; // Mã giao dịch từ VNPAY/...
    private BigDecimal amount;  // số tiền
    private String bankCode;
    private String content; //nội dung chuyển khoản
    private LocalDateTime paymentDate = LocalDateTime.now();
    private PaymentProvider paymentProvider;
    private PaymentType paymentType;
    private TransactionStatus status;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
