package com.example.sep490.entities;

import java.time.LocalDateTime;

import com.example.sep490.entities.enums.PaymentMethod;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method; // CARD, COD
    
    private String transactionId; // Mã giao dịch từ VNPAY
    private LocalDateTime paymentDate;
    private double amount;
    private String message;
    private String status; // SUCCESS, FAILED, PENDING
}

