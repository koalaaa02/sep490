package com.example.sep490.dto.publicdto;

import com.example.sep490.entity.Category;
import com.example.sep490.entity.ProductSKU;
import com.example.sep490.entity.Supplier;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponsePublic{
    private Long id; 
    private String name;
    private String description;
    private String specifications;
    
    @JsonIgnoreProperties({"products","parentCategory","subCategories"})
    private Category category;
    @JsonIgnoreProperties({"product"})
    private List<ProductSKU> skus;
    @JsonIgnoreProperties({"products"})
    private Supplier supplier;
}

