package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.AddressRequest;
import com.example.sep490.dto.AddressResponse;
import com.example.sep490.entity.Address;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(source = "id", target = "id")
    AddressResponse EntityToResponse(Address address);

    @Mapping(source = "id", target = "id")
    List<AddressResponse> entityToResponses(List<Address> address);
    
    @Mapping(source = "id", target = "id")
    Address RequestToEntity(AddressRequest addressRequest);
    
    @Mapping(source = "id", target = "id")
    List<Address> RequestsToentity(List<AddressRequest> addressRequest);
}
