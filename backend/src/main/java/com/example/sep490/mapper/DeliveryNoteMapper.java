package com.example.sep490.mapper;

import com.example.sep490.dto.DeliveryNoteRequest;
import com.example.sep490.dto.DeliveryNoteResponse;
import com.example.sep490.entity.DeliveryNote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeliveryNoteMapper {
    @Mapping(source = "id", target = "id")
    DeliveryNoteResponse EntityToResponse(DeliveryNote deliveryNote);

    @Mapping(source = "id", target = "id")
    List<DeliveryNoteResponse> entityToResponses(List<DeliveryNote> deliveryNote);
    
    @Mapping(source = "id", target = "id")
    DeliveryNote RequestToEntity(DeliveryNoteRequest deliveryNoteRequest);
    
    @Mapping(source = "id", target = "id")
    List<DeliveryNote> RequestsToentity(List<DeliveryNoteRequest> deliveryNoteRequest);
}
