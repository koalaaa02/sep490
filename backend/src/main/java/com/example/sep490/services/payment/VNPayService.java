package com.example.sep490.services.payment;

import com.example.sep490.configs.VNPayConfig;
import com.example.sep490.dto.DebtPaymentRequest;
import com.example.sep490.dto.DebtPaymentResponse;
import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.dto.TransactionResponse;
import com.example.sep490.dto.publicdto.PaymentDTO;
import com.example.sep490.dto.publicdto.PaymentResultDTO;
import com.example.sep490.entities.DebtPayment;
import com.example.sep490.entities.enums.PaymentMethod;
import com.example.sep490.entities.enums.PaymentType;
import com.example.sep490.entities.enums.TransactionStatus;
import com.example.sep490.entities.enums.TransactionType;
import com.example.sep490.services.DebtPaymentService;
import com.example.sep490.services.TransactionService;
import com.example.sep490.utils.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

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

    public PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request, long amount, String bankCode, String orderInfo) {

        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount*100));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_OrderInfo", orderInfo);

        vnpParamsMap.put("vnp_IpAddr", VNPayUtils.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtils.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtils.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtils.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentDTO.VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }

    @Transactional
    public PaymentResultDTO handleVnPayPayment(HttpServletRequest request) {
        String vnp_Amount = request.getParameter("vnp_Amount");
        String vnp_BankCode = request.getParameter("vnp_BankCode");
        String vnp_BankTranNo = request.getParameter("vnp_BankTranNo");
        String vnp_CardType = request.getParameter("vnp_CardType");
        String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
        String vnp_PayDate = request.getParameter("vnp_PayDate");
        String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");

        TransactionRequest newTransaction = TransactionRequest.builder()
                .amount(BigDecimal.ONE)
                .method(PaymentMethod.VNPAY)
                .content(vnp_OrderInfo)
                .bankCode(vnp_BankCode)
                .transactionId(vnp_TransactionNo)
                .paymentDate(LocalDateTime.now())
                .status(TransactionStatus.SUCCESS)
                .build();

        String[] parts = vnp_OrderInfo.split("_");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid vnp_OrderInfo format: " + vnp_OrderInfo);
        }
        PaymentType type = PaymentType.fromString(parts[0]);
        if (type == null) {
            throw new IllegalArgumentException("Unknown payment type: " + parts[0]);
        }
        switch (type) {
            case ORDER -> {
                Long orderId = Long.parseLong(parts[1]);
                newTransaction.setOrderId(orderId);
                newTransaction.setTransactionType(TransactionType.PAYMENT);
            }
            case PLATFORM_FEE -> {
                Long shopId = Long.parseLong(parts[1]);
                int year = Integer.parseInt(parts[2]);
                int month = Integer.parseInt(parts[3]);
            }
            case INVOICE -> {
                Long invoiceId = Long.parseLong(parts[1]);
                DebtPaymentRequest newDebtPaymentRequest = DebtPaymentRequest.builder()
                        .amountPaid(new BigDecimal(vnp_Amount))
                        .invoiceId(invoiceId)
                        .paymentDate(LocalDateTime.now())
                        .build();
                DebtPaymentResponse debtPayment = debtPaymentService.createDebtPayment(newDebtPaymentRequest);
                newTransaction.setDebtPaymentId(debtPayment.getId());
                newTransaction.setTransactionType(TransactionType.DEBTPAYMENT);
            }
            default -> throw new UnsupportedOperationException("Unsupported payment type: " + type);
        }
        transactionService.createTransaction(newTransaction);


        PaymentResultDTO result = PaymentResultDTO.builder()
                .vnp_Amount(vnp_Amount)
                .vnp_BankCode(vnp_BankCode)
                .vnp_BankTranNo(vnp_BankTranNo)
                .vnp_CardType(vnp_CardType)
                .vnp_OrderInfo(vnp_OrderInfo)
                .vnp_PayDate(vnp_PayDate)
                .vnp_TransactionNo(vnp_TransactionNo)
                .build();
//            return new ResponseObject<>(HttpStatus.OK, "Success", new PaymentDTO.VNPayResponse("00", "Success", ""));
        return result;
    }

    public String generateOrderInfo(PaymentType type, Object... params) {
        return type + "_" + Arrays.stream(params)
                .map(Object::toString)
                .collect(Collectors.joining("_"));
    }
}