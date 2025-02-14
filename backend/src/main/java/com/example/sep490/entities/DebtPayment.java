package com.example.sep490.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DebtPayment  extends Auditable{//lịch sử trả nợ cho Invoice, có thể trả từng phần
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    @OneToOne(mappedBy = "debtPayment")
    private Transaction transaction;

    private BigDecimal amountPaid;
    private LocalDateTime paymentDate = LocalDateTime.now();
}
