package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.InvoiceRequest;
import com.example.sep490.dto.InvoiceResponse;
import com.example.sep490.entity.Invoice;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    @Mapping(source = "id", target = "id")
    InvoiceResponse EntityToResponse(Invoice invoice);
    
    @Mapping(source = "id", target = "id")
    List<InvoiceResponse> entityToResponses(List<Invoice> invoice);
    
    @Mapping(source = "id", target = "id")
    Invoice RequestToEntity(InvoiceRequest invoiceRequest);
    
    @Mapping(source = "id", target = "id")
    List<Invoice> RequestsToentity(List<InvoiceRequest> invoiceRequest);
}