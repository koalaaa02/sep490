package com.example.sep490.dto;

import java.util.List;

import com.example.sep490.entities.Category;
import com.example.sep490.entities.Product;
import com.example.sep490.entities.ProductSku;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id; 
    private String name;
    private String description;
    private String specifications;
    
    @JsonIgnoreProperties("products")
    private Category category;
    private List<ProductSku> skus;
}

