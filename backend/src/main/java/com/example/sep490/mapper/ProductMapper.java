package com.example.sep490.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import com.example.sep490.dto.publicdto.ProductResponsePublic;
import com.example.sep490.entity.ProductSKU;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.entity.Product;

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
    List<ProductResponse> entityToResponses(List<Product> product);
        
    @Mapping(source = "id", target = "id")
    Product RequestToEntity(ProductRequest productRequest);
    
    @Mapping(source = "id", target = "id")
    List<Product> RequestsToentity(List<ProductRequest> productRequest);

    @AfterMapping
    default void setPriceRange(@MappingTarget ProductResponsePublic response, Product product) {
        List<ProductSKU> skus = product.getSkus();

        if (skus != null && !skus.isEmpty()) {
            BigDecimal min = skus.stream()
                    .map(ProductSKU::getSellingPrice)
                    .filter(Objects::nonNull)
                    .min(BigDecimal::compareTo)
                    .orElse(null);

            BigDecimal max = skus.stream()
                    .map(ProductSKU::getSellingPrice)
                    .filter(Objects::nonNull)
                    .max(BigDecimal::compareTo)
                    .orElse(null);

            if (min != null && max != null) {
                if (min.equals(max)) {
                    response.setPriceRange(String.format("%.0f", min));
                } else {
                    response.setPriceRange(String.format("%.0f-%.0f", min, max));
                }
            }
        }
    }


//    @AfterMapping
//    void customizeDTO(Product product, @MappingTarget ProductDTO productDTO) {
//        productDTO.setName("Generated at: " + System.currentTimeMillis());
//    }
}


//@Mapping(target = "category", ignore = true)