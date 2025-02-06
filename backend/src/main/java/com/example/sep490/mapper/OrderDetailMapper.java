package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.sep490.dto.OrderDetailRequest;
import com.example.sep490.dto.OrderDetailResponse;
import com.example.sep490.entities.OrderDetail;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    OrderDetailResponse EntityToResponse(OrderDetail orderDetail);
    
    List<OrderDetailResponse> EntitiesToResponses(List<OrderDetail> orderDetail);
    
    OrderDetail RequestToEntity(OrderDetailRequest orderDetailRequest);
    
    List<OrderDetail> RequestsToEntities(List<OrderDetailRequest> orderDetailRequest);
}
