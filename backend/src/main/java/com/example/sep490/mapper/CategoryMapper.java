package com.example.sep490.mapper;

import java.util.List;

import com.example.sep490.dto.publicdto.CategoryResponsePublic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.CategoryRequest;
import com.example.sep490.dto.CategoryResponse;
import com.example.sep490.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(source = "id", target = "id")
    CategoryResponse EntityToResponse(Category category);

    @Mapping(source = "id", target = "id")
    CategoryResponsePublic EntityToResponsePublic(Category category);
    
    @Mapping(source = "id", target = "id")
    List<CategoryResponse> entityToResponses(List<Category> category);
    
    @Mapping(source = "id", target = "id")
    Category RequestToEntity(CategoryRequest categoryRequest);
    
    @Mapping(source = "id", target = "id")
    List<Category> RequestsToentity(List<CategoryRequest> categoryRequest);
}


//@Mapping(target = "category", ignore = true)
//@Mapping(target = "subCategories", ignore = true) // Tránh vòng lặp