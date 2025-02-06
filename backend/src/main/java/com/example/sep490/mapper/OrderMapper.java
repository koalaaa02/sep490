package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.OrderRequest;
import com.example.sep490.dto.OrderResponse;
import com.example.sep490.entities.Order;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(source = "id", target = "id")
    OrderResponse EntityToResponse(Order order);
    
    @Mapping(source = "id", target = "id")
    List<OrderResponse> EntitiesToResponses(List<Order> order);
    
    @Mapping(source = "id", target = "id")
    Order RequestToEntity(OrderRequest orderRequest);
    
    @Mapping(source = "id", target = "id")
    List<Order> RequestsToEntities(List<OrderRequest> orderRequest);
}
