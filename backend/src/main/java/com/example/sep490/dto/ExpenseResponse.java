package com.example.sep490.dto;

import java.math.BigDecimal;

import com.example.sep490.entities.enums.ExpenseType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {
	private Long id;

    private ExpenseType expenseType;

    private BigDecimal amount;

    private String description;
}
