package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.ExpenseRequest;
import com.example.sep490.dto.ExpenseResponse;
import com.example.sep490.entities.Expense;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {
    @Mapping(source = "id", target = "id")
    ExpenseResponse EntityToResponse(Expense expense);
    
    @Mapping(source = "id", target = "id")
    List<ExpenseResponse> EntitiesToResponses(List<Expense> expense);
    
    @Mapping(source = "id", target = "id")
    Expense RequestToEntity(ExpenseRequest expenseRequest);
    
    @Mapping(source = "id", target = "id")
    List<Expense> RequestsToEntities(List<ExpenseRequest> expenseRequest);
}
