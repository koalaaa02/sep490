package com.example.sep490.dto;

import java.util.List;

import com.example.sep490.entities.Auditable;
import com.example.sep490.entities.Category;
import com.example.sep490.entities.Product;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import lombok.Data;

@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class CategoryResponse extends Auditable {
	private Long id;
    private String name;
    private boolean isParent;
    private String images;

    @JsonIgnoreProperties({"subCategories", "products"})
    private Category parentCategory; 
    
    @JsonIgnoreProperties({"subCategories","products"})
    private List<Category> subCategories; 
    
    @JsonIgnoreProperties({"category","shop","skus","supplier"})
    private List<Product> products;
}
//@JsonIgnoreProperties("category")
