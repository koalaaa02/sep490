package com.example.sep490.dto;

import java.util.List;

import com.example.sep490.entities.Category;
import com.example.sep490.entities.Product;
import com.example.sep490.entities.ProductSKU;
import com.example.sep490.entities.Supplier;
import com.example.sep490.entities.enums.UnitType;
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
    private String images;

    @JsonIgnoreProperties({"products","parentCategory","subCategories"})
    private Category category;
    @JsonIgnoreProperties({"product"})
    private List<ProductSKU> skus;
    @JsonIgnoreProperties({"products"})
    private Supplier supplier;
}

