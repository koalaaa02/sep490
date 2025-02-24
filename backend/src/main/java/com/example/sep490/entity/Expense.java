package com.example.sep490.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.enums.ExpenseType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "tbl_expense")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense  extends Auditable{//Quản lí số tiền chi tiêu

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ExpenseType expenseType;

    @Column(nullable = false)
    private BigDecimal amount;

    // Relationship
}
