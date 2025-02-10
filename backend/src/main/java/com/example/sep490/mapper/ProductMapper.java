package com.example.sep490.mapper;

import java.util.List;

import com.example.sep490.dto.publicdto.ProductResponsePublic;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.entities.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
	// Nếu muốn dùng instance thay vì inject
    //ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

	//@Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "id", target = "id")
    ProductResponse EntityToResponse(Product product);

    @Mapping(source = "id", target = "id")
    ProductResponsePublic EntityToResponsePublic(Product product);
    
    @Mapping(source = "id", target = "id")
    List<ProductResponse> EntitiesToResponses(List<Product> product);
        
    @Mapping(source = "id", target = "id")
    Product RequestToEntity(ProductRequest productRequest);
    
    @Mapping(source = "id", target = "id")
    List<Product> RequestsToEntities(List<ProductRequest> productRequest);
//    @AfterMapping
//    void customizeDTO(Product product, @MappingTarget ProductDTO productDTO) {
//        productDTO.setName("Generated at: " + System.currentTimeMillis());
//    }
}


//@Mapping(target = "category", ignore = true)