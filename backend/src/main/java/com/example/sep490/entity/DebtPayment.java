package com.example.sep490.entity;

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
@Table(name = "tbl_debt_payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DebtPayment  extends Auditable{//lịch sử trả nợ cho Invoice, có thể trả từng phần
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal amountPaid;
    private LocalDateTime paymentDate = LocalDateTime.now();

    // Relationship
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    @OneToOne(mappedBy = "debtPayment")
    private Transaction transaction;
}
