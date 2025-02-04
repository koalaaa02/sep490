package com.example.sep490.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.example.sep490.dto.ProductDTO;
import com.example.sep490.entities.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
	// Nếu muốn dùng instance thay vì inject
    //ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

	//@Mapping(source = "category.name", target = "categoryName")
    ProductDTO toDTO(Product product);
    Product toEntity(ProductDTO productDTO);
    
//    @AfterMapping
//    void customizeDTO(Product product, @MappingTarget ProductDTO productDTO) {
//        productDTO.setName("Generated at: " + System.currentTimeMillis());
//    }
}


//@Mapping(target = "category", ignore = true)