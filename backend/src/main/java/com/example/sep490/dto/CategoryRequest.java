package com.example.sep490.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {
	private Long id;
    private String name;
    private String images;

    @JsonProperty("isParent")
    private boolean isParent;
    private Long parentCategoryId; 
}

