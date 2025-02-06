package com.example.sep490.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private Long id; 
    private String name;
    private String description;
    private String specifications;
    private Long categoryId; 
}

