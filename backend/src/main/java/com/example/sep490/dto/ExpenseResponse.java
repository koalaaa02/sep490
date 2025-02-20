package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entities.Auditable;
import com.example.sep490.entities.enums.ExpenseType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse{
	private Long id;
    private ExpenseType expenseType;
    private BigDecimal amount;
    private String description;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
