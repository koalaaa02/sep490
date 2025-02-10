package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.entities.*;
import com.example.sep490.repositories.*;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.ExpenseRequest;
import com.example.sep490.dto.ExpenseResponse;
import com.example.sep490.mapper.ExpenseMapper;
import com.example.sep490.entities.Expense;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ExpenseMapper expenseMapper;
    @Autowired
    private BasePagination pagination;

    public PageResponse<ExpenseResponse> getExpenses(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Expense> expensePage = expenseRepo.findByIsDeleteFalse(pageable);
        Page<ExpenseResponse> expenseResponsePage = expensePage.map(expenseMapper::EntityToResponse);
        return pagination.createPageResponse(expenseResponsePage);
    }

    public ExpenseResponse getExpenseById(Long id) {
        Optional<Expense> Expense = expenseRepo.findByIdAndIsDeleteFalse(id);
        if (Expense.isPresent()) {
            return expenseMapper.EntityToResponse(Expense.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public ExpenseResponse createExpense(ExpenseRequest expenseRequest) {

        Expense entity = expenseMapper.RequestToEntity(expenseRequest);
        return expenseMapper.EntityToResponse(expenseRepo.save(entity));
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest expenseRequest) {
        Expense expense = expenseRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        try {
            objectMapper.updateValue(expense, expenseRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        return expenseMapper.EntityToResponse(expenseRepo.save(expense));


    }

    public void deleteExpense(Long id) {
        Expense updatedExpense = expenseRepo.findByIdAndIsDeleteFalse(id)
                .map(existingExpense -> {
                    existingExpense.setDelete(true);
                    return expenseRepo.save(existingExpense);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private Expense getExpense(Long id) {
        return id == null ? null
                : expenseRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}