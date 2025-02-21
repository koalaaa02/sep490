package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entity.DebtPayment;
import com.example.sep490.entity.enums.PaymentMethod;
import com.example.sep490.entity.enums.TransactionStatus;
import com.example.sep490.entity.enums.TransactionType;

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

	@NotNull(message = "Phương thức thanh toán không được để trống.")
    private PaymentMethod method; // CARD, COD
    
    private String transactionId; // Mã giao dịch từ VNPAY/...

    @NotNull(message = "Số tiền không được để trống.")
    @DecimalMin(value = "0.00", message = "Số tiền phải >= 0.")
    private BigDecimal amount;  // số tiền

    private String bankCode;

    private String content; //nội dung chuyển khoản

    private LocalDateTime paymentDate = LocalDateTime.now();

	@NotNull(message = "Loại thanh toán không được để trống.")
    private TransactionType transactionType;

	@NotNull(message = "Status được để trống.")
    private TransactionStatus status;


    // Relationship
}
