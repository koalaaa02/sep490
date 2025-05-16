package com.example.sep490.dto;

import com.example.sep490.entity.Address;
import com.example.sep490.entity.DeliveryDetail;
import com.example.sep490.entity.Order;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryNoteResponse {
    private Long id;
    private String deliveryCode;
    private LocalDateTime deliveredDate;
    private BigDecimal totalAmount;
    private boolean delivered;
    private boolean paid;

    @JsonIgnoreProperties({"user","shop"})
    private Address address;
    @JsonIgnoreProperties({ "orderDetails", "transaction", "invoice","address","shop","deliveryNotes"})
    private Order order;
    @JsonIgnoreProperties({"deliveryNote"})
    private List<DeliveryDetail> deliveryDetails;

    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
