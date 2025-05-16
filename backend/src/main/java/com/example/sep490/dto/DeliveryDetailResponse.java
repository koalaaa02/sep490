package com.example.sep490.dto;

import com.example.sep490.entity.DeliveryNote;
import com.example.sep490.entity.compositeKeys.OrderDetailId;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryDetailResponse {
    private Long id;
    private String productName;
    private String productSKUCode;
    private String unit;
    private int quantity;
    private BigDecimal price;

    @JsonIgnoreProperties({"address","order","deliveryDetails"})
    private DeliveryNote deliveryNote;
    private OrderDetailId orderDetailId;

    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
