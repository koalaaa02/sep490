package com.example.sep490.dto.publicdto;

import com.example.sep490.entities.Auditable;
import com.example.sep490.entities.Category;
import com.example.sep490.entities.Product;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;

import java.util.List;

@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class CategoryResponsePublic extends Auditable {
	private Long id;
    private String name;
    private boolean isParent;
    
    @JsonIgnoreProperties({"subCategories", "products"})
    private Category parentCategory; 
    
    @JsonIgnoreProperties({"subCategories","products"})
    private List<Category> subCategories; 
    
    @JsonIgnoreProperties({"category","shop","skus","supplier"})
    private List<Product> products;
}
//@JsonIgnoreProperties("category")
