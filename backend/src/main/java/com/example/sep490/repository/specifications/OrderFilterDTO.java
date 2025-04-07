package com.example.sep490.repository.specifications;

import com.example.sep490.entity.enums.DeliveryMethod;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.entity.enums.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderFilterDTO {
    @Schema(defaultValue = "1")
    private int page = 1;
    @Schema(defaultValue = "10")
    private int size = 10;
    @Schema(defaultValue = "id")
    private String sortBy = "id";
    @Schema(defaultValue = "ASC")
    private String direction = "ASC";

    private Long Id;
    private String orderCode;
    private String deliveryCode;
    @JsonIgnore
    private Long shopId;

    private DeliveryMethod deliveryMethod;
    private PaymentMethod paymentMethod;
    @Schema(defaultValue = "PENDING")
    private OrderStatus status;
    @Schema(defaultValue = "false")
    private boolean paid;

    @JsonIgnore
    private Long createdBy;
}

