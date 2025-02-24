package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.ExpenseRequest;
import com.example.sep490.dto.ExpenseResponse;
import com.example.sep490.entity.Expense;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {
    @Mapping(source = "id", target = "id")
    ExpenseResponse EntityToResponse(Expense expense);
    
    @Mapping(source = "id", target = "id")
    List<ExpenseResponse> entityToResponses(List<Expense> expense);
    
    @Mapping(source = "id", target = "id")
    Expense RequestToEntity(ExpenseRequest expenseRequest);
    
    @Mapping(source = "id", target = "id")
    List<Expense> RequestsToentity(List<ExpenseRequest> expenseRequest);
}
