package com.example.sep490.dto;

import com.example.sep490.entity.DeliveryNote;
import com.example.sep490.entity.OrderDetail;
import com.example.sep490.entity.compositeKeys.OrderDetailId;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryDetailRequest {
    private Long id;
    private String productName;
    private String productSKUCode;
    private String unit;
    private int quantity;
    private BigDecimal price;

    private Long deliveryNoteId;
    private OrderDetailId orderDetailId;
}
