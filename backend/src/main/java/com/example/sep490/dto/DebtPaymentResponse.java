package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entities.Invoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DebtPaymentResponse {
    private Long id;
    private Invoice invoice;
    private BigDecimal amountPaid;
    private LocalDateTime paymentDate = LocalDateTime.now();
}
