package com.example.sep490.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.*;
import com.example.sep490.entity.enums.UnitType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id; 
    private String name;
    private String description;
    private String specifications;
    private UnitType unit;
    private String unitAdvance;
    private String images;
    private boolean active;
    private boolean stop;

    @JsonIgnoreProperties({"products","parentCategory","subCategories"})
    private Category category;
//    @JsonIgnoreProperties({"product"})
//    private List<ProductSKU> skus;
    @JsonIgnoreProperties({"products"})
    private Supplier supplier;
    @JsonIgnoreProperties({"orders","manager","address","bankAccount","products"})
    private Shop shop;

    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}

