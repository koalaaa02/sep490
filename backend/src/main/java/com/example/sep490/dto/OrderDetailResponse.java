package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entities.Auditable;
import com.example.sep490.entities.Order;
import com.example.sep490.entities.ProductSKU;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonIgnoreProperties({ "orderDetails", "transaction", "invoice","address","shop"})
    private Order order;

    @NotNull
    private ProductSKUResponse productSku;
    private int quantity;
    private BigDecimal price;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
