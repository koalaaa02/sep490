package com.example.sep490.dto;

import java.math.BigDecimal;
import java.util.List;

import com.example.sep490.entities.DebtPayment;
import com.example.sep490.entities.enums.InvoiceStatus;

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

    private Long agentId; // người Đại lý nợ
    
    @NotNull(message = "Số tiền không được để trống.")
    @DecimalMin(value = "0.00", message = "Số tiền phải >= 0.")
    private BigDecimal totalAmount; //tổng nợ phải trả
    
    @NotNull(message = "Số tiền không được để trống.")
    @DecimalMin(value = "0.00", message = "Số tiền phải >= 0.")
    private BigDecimal paidAmount = BigDecimal.ZERO; // Ban đầu = 0, khi đại lý trả sẽ tăng lên

    private InvoiceStatus status = InvoiceStatus.UNPAID;; // UNPAID, PARTIALLY_PAID, PAID

}
