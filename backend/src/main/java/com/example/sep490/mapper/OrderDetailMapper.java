package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.sep490.dto.OrderDetailRequest;
import com.example.sep490.dto.OrderDetailResponse;
import com.example.sep490.entity.OrderDetail;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    OrderDetailResponse EntityToResponse(OrderDetail orderDetail);
    
    List<OrderDetailResponse> entityToResponses(List<OrderDetail> orderDetail);
    
    OrderDetail RequestToEntity(OrderDetailRequest orderDetailRequest);
    
    List<OrderDetail> RequestsToentity(List<OrderDetailRequest> orderDetailRequest);
}
