package com.example.sep490.services.payment;

import com.example.sep490.configs.VNPayConfig;
import com.example.sep490.dto.DebtPaymentRequest;
import com.example.sep490.dto.DebtPaymentResponse;
import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.dto.publicdto.VNPayResponse;
import com.example.sep490.dto.publicdto.PaymentResultDTO;
import com.example.sep490.entities.Order;
import com.example.sep490.entities.enums.PaymentMethod;
import com.example.sep490.entities.enums.PaymentType;
import com.example.sep490.entities.enums.TransactionStatus;
import com.example.sep490.entities.enums.TransactionType;
import com.example.sep490.factory.PaymentStrategyFactory;
import com.example.sep490.repositories.OrderRepository;
import com.example.sep490.services.DebtPaymentService;
import com.example.sep490.services.TransactionService;
import com.example.sep490.strategy.PaymentStrategy;
import com.example.sep490.utils.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VNPayService {
    private final VNPayConfig vnPayConfig;
    private final TransactionService transactionService;
    private final DebtPaymentService debtPaymentService;
    private final OrderRepository orderRepo;
    private final PaymentStrategyFactory paymentStrategyFactory;

    public VNPayResponse createVnPayPayment(HttpServletRequest request, long amount, String bankCode, PaymentType paymentType, Long referenceId) {
        PaymentStrategy strategy = paymentStrategyFactory.getPaymentStrategy(paymentType);
        return strategy.processPayment(request, amount, bankCode, referenceId);
    }

    public PaymentResultDTO handleVnPayPayment(HttpServletRequest request) {
        String paymentType = request.getParameter("vnp_OrderInfo").split("_")[0];
        PaymentStrategy strategy = paymentStrategyFactory.getPaymentStrategy(PaymentType.valueOf(paymentType));
        return strategy.handleVnPayPayment(request);
    }
}