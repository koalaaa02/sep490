package com.example.sep490.dto;

import com.example.sep490.entity.Address;
import com.example.sep490.entity.DeliveryDetail;
import com.example.sep490.entity.Order;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
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
public class DeliveryNoteRequest {
    private Long id;
    private String deliveryCode;
    private LocalDateTime deliveredDate;
    private BigDecimal totalAmount = BigDecimal.ZERO;
    @Schema(defaultValue = "false")
    private boolean delivered = false;
    @Schema(defaultValue = "false")
    private boolean paid = false;

    @JsonIgnore
    private Long addressId;
    private Long orderId;

    private List<DeliveryDetailRequest> deliveryDetails;
}
