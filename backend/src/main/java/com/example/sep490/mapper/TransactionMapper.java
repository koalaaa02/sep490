package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.dto.TransactionResponse;
import com.example.sep490.entity.Transaction;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    @Mapping(source = "id", target = "id")
    TransactionResponse EntityToResponse(Transaction transaction);
    
    @Mapping(source = "id", target = "id")
    List<TransactionResponse> entityToResponses(List<Transaction> transaction);
    
    @Mapping(source = "id", target = "id")
    Transaction RequestToEntity(TransactionRequest transactionRequest);
    
    @Mapping(source = "id", target = "id")
    List<Transaction> RequestsToentity(List<TransactionRequest> transactionRequest);
}