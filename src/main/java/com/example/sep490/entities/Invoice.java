package com.example.sep490.entities;

import java.util.List;

import com.example.sep490.entities.enums.InvoiceStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent; // Đại lý nợ

    private double totalAmount;
    private double paidAmount = 0.0; // Ban đầu = 0, khi đại lý trả sẽ tăng lên

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status; // UNPAID, PARTIALLY_PAID, PAID

    @OneToMany(mappedBy = "invoice")
    private List<DebtPayment> debtPayments;
}
