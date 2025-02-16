package com.example.sep490.services;

import java.util.List;
import java.util.Optional;

import com.example.sep490.dto.AddressResponse;
import com.example.sep490.entities.*;
import com.example.sep490.repositories.*;
import com.example.sep490.repositories.specifications.TransactionFilterDTO;
import com.example.sep490.repositories.specifications.TransactionSpecification;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private ObjectMapper objectMapper;
    @Autowired
    private TransactionMapper transactionMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private UserService userService;

    public PageResponse<TransactionResponse> getTransactions(TransactionFilterDTO filter) {
        Shop shop = userService.getShopByContextUser();
        if(shop == null ) throw new RuntimeException("Không tìm thấy cửa hàng.");
        filter.setShopId(shop.getId());
        Specification<Transaction> spec = TransactionSpecification.filterTransactiones(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Transaction> transactionPage = transactionRepo.findAll(spec, pageable);
        Page<TransactionResponse> transactionResponsePage = transactionPage.map(transactionMapper::EntityToResponse);
        return pagination.createPageResponse(transactionResponsePage);
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
        Transaction transaction = transactionRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        Order order = getOrder(transactionRequest.getOrderId());

        try {
            objectMapper.updateValue(transaction, transactionRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        transaction.setOrder(order);
        return transactionMapper.EntityToResponse(transactionRepo.save(transaction));
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