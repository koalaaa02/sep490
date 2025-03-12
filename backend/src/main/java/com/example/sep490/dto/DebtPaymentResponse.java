package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entity.Auditable;
import com.example.sep490.entity.Invoice;

import com.example.sep490.entity.Transaction;
import com.fasterxml.jackson.annotation.JsonFormat;
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
public class DebtPaymentResponse{
    private Long id;
    @JsonIgnoreProperties({"debtPayments","agent","order"})
    private Invoice invoice;
    @JsonIgnoreProperties({ "debtPayment", "order"})
    private Transaction transaction;
    private BigDecimal amountPaid;

    @JsonFormat(pattern = "yyyy-MM-dd 'at' HH:mm:ss")
    private LocalDateTime paymentDate = LocalDateTime.now();


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
