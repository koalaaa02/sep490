package com.example.sep490.dto;

import java.math.BigDecimal;

import com.example.sep490.entities.enums.ExpenseType;


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
public class ExpenseRequest {
	private Long id;

	@NotNull(message = "Loại chi tiêu không được để trống.")
    private ExpenseType expenseType;

	@NotNull(message = "Số tiền không được để trống.")
    @DecimalMin(value = "1.00", message = "Số tiền phải >= 0.")
    private BigDecimal amount;

    private String description;

    // Relationship
}
