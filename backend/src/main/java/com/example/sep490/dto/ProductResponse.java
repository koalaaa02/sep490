package com.example.sep490.dto;

import java.util.List;

import com.example.sep490.entities.Category;
import com.example.sep490.entities.Product;
import com.example.sep490.entities.ProductSKU;
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
    
    @JsonIgnoreProperties("products")
    private Category category;
    private List<ProductSKU> skus;
}

