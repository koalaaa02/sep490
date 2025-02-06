package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.ShippingAddressRequest;
import com.example.sep490.dto.ShippingAddressResponse;
import com.example.sep490.entities.ShippingAddress;

@Mapper(componentModel = "spring")
public interface ShippingAddressMapper {
    @Mapping(source = "id", target = "id")
    ShippingAddressResponse EntityToResponse(ShippingAddress shippingAddress);
    
    @Mapping(source = "id", target = "id")
    List<ShippingAddressResponse> EntitiesToResponses(List<ShippingAddress> shippingAddress);
    
    @Mapping(source = "id", target = "id")
    ShippingAddress RequestToEntity(ShippingAddressRequest shippingAddressRequest);
    
    @Mapping(source = "id", target = "id")
    List<ShippingAddress> RequestsToEntities(List<ShippingAddressRequest> shippingAddressRequest);
}
