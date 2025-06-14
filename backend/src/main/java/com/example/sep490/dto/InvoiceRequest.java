package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.DebtPayment;
import com.example.sep490.entity.Order;
import com.example.sep490.entity.enums.InvoiceStatus;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class InvoiceRequest {
	private Long id;
    @JsonIgnore
    private String invoiceCode;

    private LocalDateTime deliveryDate = LocalDateTime.now();
    private String deliveryProofImage;
    private String deliveryNote;

    @NotNull(message = "Số tiền không được để trống.")
    @DecimalMin(value = "0.00", message = "Số tiền phải >= 0.")
    private BigDecimal totalAmount; //tổng nợ phải trả
    @NotNull(message = "Số tiền không được để trống.")
    @DecimalMin(value = "0.00", message = "Số tiền phải >= 0.")
    private BigDecimal paidAmount = BigDecimal.ZERO; // Ban đầu = 0, khi đại lý trả sẽ tăng lên
    private InvoiceStatus status = InvoiceStatus.UNPAID;; // UNPAID, PARTIALLY_PAID, PAID

    // Relationship
    private Long orderId;



}
