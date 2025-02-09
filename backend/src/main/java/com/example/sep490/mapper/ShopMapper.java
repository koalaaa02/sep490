package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.ShopRequest;
import com.example.sep490.dto.ShopResponse;
import com.example.sep490.entities.Shop;

@Mapper(componentModel = "spring")
public interface ShopMapper {
    @Mapping(source = "id", target = "id")
    ShopResponse EntityToResponse(Shop shop);
    
    @Mapping(source = "id", target = "id")
    List<ShopResponse> EntitiesToResponses(List<Shop> shop);
    
    @Mapping(source = "id", target = "id")
    @Mapping(source = "active", target = "isActive")
    Shop RequestToEntity(ShopRequest shopRequest);
    
    @Mapping(source = "id", target = "id")
    List<Shop> RequestsToEntities(List<ShopRequest> shopRequest);
}