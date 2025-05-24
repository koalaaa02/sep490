package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entity.DebtPayment;
import com.example.sep490.entity.enums.*;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequest {
	private Long id;

    private Long orderId;
    private Long debtPaymentId;

    private String transactionId; // Mã giao dịch từ VNPAY/...

    @NotNull(message = "Số tiền không được để trống.")
    @DecimalMin(value = "0.00", message = "Số tiền phải >= 0.")
    private BigDecimal amount;  // số tiền

    private String bankCode;

    private String content; //nội dung chuyển khoản

    private LocalDateTime paymentDate = LocalDateTime.now();

    @NotNull(message = "Đơn vị thanh toán không được để trống.")
    private PaymentProvider paymentProvider;

    @NotNull(message = "Loại thanh toán không được để trống.")
    private PaymentType paymentType;

	@NotNull(message = "Status được để trống.")
    private TransactionStatus status;


    // Relationship
    private Long shopId;
    private Long invoiceId;
}
