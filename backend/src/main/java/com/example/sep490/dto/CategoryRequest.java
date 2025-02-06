package com.example.sep490.dto;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import com.example.sep490.entities.Category;
import com.example.sep490.entities.Product;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
public class CategoryRequest {
	private Long id;
    private String name;
    private boolean isParent;
    private Long parentCategoryId; 

}

