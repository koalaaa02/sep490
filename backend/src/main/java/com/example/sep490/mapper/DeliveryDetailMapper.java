package com.example.sep490.mapper;

import com.example.sep490.dto.DeliveryDetailRequest;
import com.example.sep490.dto.DeliveryDetailResponse;
import com.example.sep490.entity.DeliveryDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeliveryDetailMapper {
    @Mapping(source = "id", target = "id")
    DeliveryDetailResponse EntityToResponse(DeliveryDetail deliveryDetail);

    @Mapping(source = "id", target = "id")
    List<DeliveryDetailResponse> entityToResponses(List<DeliveryDetail> deliveryDetail);

    @Mapping(source = "id", target = "id")
    DeliveryDetail RequestToEntity(DeliveryDetailRequest deliveryDetailRequest);

    @Mapping(source = "id", target = "id")
    List<DeliveryDetail> RequestsToentity(List<DeliveryDetailRequest> deliveryDetailRequest);
}