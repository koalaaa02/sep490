package com.example.sep490.repository.specifications;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductFilterDTO {
    @Schema(defaultValue = "1")
    private int page = 1;
    @Schema(defaultValue = "10")
    private int size = 10;
    @Schema(defaultValue = "id")
    private String sortBy = "id";
    @Schema(defaultValue = "ASC")
    private String direction = "ASC";
    @Schema(defaultValue = "true", description = "mặc định là true đối với public api")
    private boolean active = true;

    private String name;
    @Schema(description = "Category ID (null nếu không lọc)", nullable = true)
    private Long categoryId = null;
    @Schema(defaultValue = "null")
    private Long shopId;
    @Schema(defaultValue = "null")
    private Long createdBy;
    @Schema(defaultValue = "null")
    private BigDecimal minPrice;
    @Schema(defaultValue = "null")
    private BigDecimal maxPrice;
}

