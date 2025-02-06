package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.SupplierRequest;
import com.example.sep490.dto.SupplierResponse;
import com.example.sep490.entities.Supplier;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    @Mapping(source = "id", target = "id")
    SupplierResponse EntityToResponse(Supplier supplier);
    
    @Mapping(source = "id", target = "id")
    List<SupplierResponse> EntitiesToResponses(List<Supplier> supplier);
    
    @Mapping(source = "id", target = "id")
    Supplier RequestToEntity(SupplierRequest supplierRequest);
    
    @Mapping(source = "id", target = "id")
    List<Supplier> RequestsToEntities(List<SupplierRequest> supplierRequest);
}
