package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.DebtPaymentRequest;
import com.example.sep490.dto.DebtPaymentResponse;
import com.example.sep490.entity.DebtPayment;

@Mapper(componentModel = "spring")
public interface DebtPaymentMapper {
    @Mapping(source = "id", target = "id")
    DebtPaymentResponse EntityToResponse(DebtPayment debtPayment);
    
    @Mapping(source = "id", target = "id")
    List<DebtPaymentResponse> entityToResponses(List<DebtPayment> debtPayment);
    
    @Mapping(source = "id", target = "id")
    DebtPayment RequestToEntity(DebtPaymentRequest debtPaymentRequest);
    
    @Mapping(source = "id", target = "id")
    List<DebtPayment> RequestsToentity(List<DebtPaymentRequest> debtPaymentRequest);
}
