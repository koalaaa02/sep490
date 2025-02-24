package com.example.sep490.service;

import java.util.Optional;

import com.example.sep490.repository.*;
import com.example.sep490.repository.specifications.ExpenseFilterDTO;
import com.example.sep490.repository.specifications.ExpenseSpecification;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.ExpenseRequest;
import com.example.sep490.dto.ExpenseResponse;
import com.example.sep490.mapper.ExpenseMapper;
import com.example.sep490.entity.Expense;
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
    @Autowired
    private UserService userService;

    public PageResponse<ExpenseResponse> getExpenses(ExpenseFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<Expense> spec = ExpenseSpecification.filterExpenses(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Expense> expensePage = expenseRepo.findAll(spec, pageable);
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