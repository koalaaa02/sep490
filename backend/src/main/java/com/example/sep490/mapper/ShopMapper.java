package com.example.sep490.mapper;

import java.util.List;

import com.example.sep490.dto.publicdto.ShopResponsePublic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.ShopRequest;
import com.example.sep490.dto.ShopResponse;
import com.example.sep490.entity.Shop;

@Mapper(componentModel = "spring")
public interface ShopMapper {
    @Mapping(source = "id", target = "id")
    ShopResponse EntityToResponse(Shop shop);

    @Mapping(source = "id", target = "id")
    ShopResponsePublic EntityToResponsePublic(Shop shop);

    @Mapping(source = "id", target = "id")
    List<ShopResponse> entityToResponses(List<Shop> shop);
    
    @Mapping(source = "id", target = "id")
    Shop RequestToEntity(ShopRequest shopRequest);
    
    @Mapping(source = "id", target = "id")
    List<Shop> RequestsToentity(List<ShopRequest> shopRequest);
}