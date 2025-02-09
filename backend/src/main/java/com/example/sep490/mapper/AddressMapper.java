package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.AddressRequest;
import com.example.sep490.dto.AddressResponse;
import com.example.sep490.entities.Address;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(source = "id", target = "id")
    AddressResponse EntityToResponse(Address Address);
    
    @Mapping(source = "id", target = "id")
    List<AddressResponse> EntitiesToResponses(List<Address> Address);
    
    @Mapping(source = "id", target = "id")
    Address RequestToEntity(AddressRequest AddressRequest);
    
    @Mapping(source = "id", target = "id")
    List<Address> RequestsToEntities(List<AddressRequest> AddressRequest);
}
