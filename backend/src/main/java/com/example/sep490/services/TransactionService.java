package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.entities.*;
import com.example.sep490.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.dto.TransactionResponse;
import com.example.sep490.mapper.TransactionMapper;
import com.example.sep490.entities.Transaction;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepo;
    @Autowired
    private TransactionMapper transactionMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private OrderRepository orderRepo;

    public PageResponse<Transaction> getTransactions(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Transaction> transactionPage = transactionRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(transactionPage);
    }

    public TransactionResponse getTransactionById(Long id) {
        Optional<Transaction> Transaction = transactionRepo.findByIdAndIsDeleteFalse(id);
        if (Transaction.isPresent()) {
            return transactionMapper.EntityToResponse(Transaction.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public TransactionResponse createTransaction(TransactionRequest transactionRequest) {
        Order order = getOrder(transactionRequest.getOrderId());

        Transaction entity = transactionMapper.RequestToEntity(transactionRequest);
        entity.setOrder(order);
        return transactionMapper.EntityToResponse(transactionRepo.save(entity));
    }

    public TransactionResponse updateTransaction(Long id, TransactionRequest transactionRequest) {
        Transaction Transaction = transactionRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        Order order = getOrder(transactionRequest.getOrderId());

        Transaction entity = transactionMapper.RequestToEntity(transactionRequest);
        entity.setOrder(order);
        Transaction updatedTransaction = transactionRepo.save(entity);
        return transactionMapper.EntityToResponse(updatedTransaction);

    }

    public void deleteTransaction(Long id) {
        Transaction updatedTransaction = transactionRepo.findByIdAndIsDeleteFalse(id)
                .map(existingTransaction -> {
                    existingTransaction.setDelete(true);
                    return transactionRepo.save(existingTransaction);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private Transaction getTransaction(Long id) {
        return id == null ? null
                : transactionRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Order getOrder(Long id) {
        return id == null ? null
                : orderRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}