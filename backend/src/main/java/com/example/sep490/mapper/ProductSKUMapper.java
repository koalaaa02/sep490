package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.ProductSKURequest;
import com.example.sep490.dto.ProductSKUResponse;
import com.example.sep490.entity.ProductSKU;

@Mapper(componentModel = "spring")
public interface ProductSKUMapper {
    @Mapping(source = "id", target = "id")
    ProductSKUResponse EntityToResponse(ProductSKU productSKU);
    
    @Mapping(source = "id", target = "id")
    List<ProductSKUResponse> entityToResponses(List<ProductSKU> productSKU);
    
    @Mapping(source = "id", target = "id")
    ProductSKU RequestToEntity(ProductSKURequest productSKURequest);
    
    @Mapping(source = "id", target = "id")
    List<ProductSKU> RequestsToentity(List<ProductSKURequest> productSKURequest);
}