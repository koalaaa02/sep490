package com.example.sep490.repositories.specifications;

import com.example.sep490.entities.Shop;
import com.example.sep490.entities.enums.DeliveryMethod;
import com.example.sep490.entities.enums.OrderStatus;
import com.example.sep490.entities.enums.PaymentMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

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
    @Schema(defaultValue = "PENDING")
    private OrderStatus status;
    private String deliveryCode;
    private Long shopId;
    private Long createdBy;

}

