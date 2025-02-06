package com.example.sep490.dto;

import java.math.BigDecimal;

import com.example.sep490.entities.Order;
import com.example.sep490.entities.ProductSKU;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailResponse {
	@NotNull
    private Order order;

    @NotNull 
    private ProductSKU productSku;

    private int quantity;
    private BigDecimal price;
}
