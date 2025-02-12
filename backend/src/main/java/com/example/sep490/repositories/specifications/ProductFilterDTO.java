package com.example.sep490.repositories.specifications;

import com.example.sep490.entities.Shop;
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

    private String name;
    private Long categoryId;
    private Long shopId;
    private Long createdBy;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}

