package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.CategoryRequest;
import com.example.sep490.dto.CategoryResponse;
import com.example.sep490.entities.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(source = "id", target = "id")
    CategoryResponse EntityToResponse(Category category);
    
    @Mapping(source = "id", target = "id")
    List<CategoryResponse> EntitiesToResponses(List<Category> category);
    
    @Mapping(source = "id", target = "id")
    @Mapping(source = "parent", target = "isParent")
    Category RequestToEntity(CategoryRequest categoryRequest);
    
    @Mapping(source = "id", target = "id")
    List<Category> RequestsToEntities(List<CategoryRequest> categoryRequest);
}


//@Mapping(target = "category", ignore = true)
//@Mapping(target = "subCategories", ignore = true) // Tránh vòng lặp