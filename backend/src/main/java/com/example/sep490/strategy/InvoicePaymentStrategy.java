package com.example.sep490.strategy;

import com.example.sep490.configs.VNPayConfig;
import com.example.sep490.dto.DebtPaymentRequest;
import com.example.sep490.dto.DebtPaymentResponse;
import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.dto.publicdto.PaymentResponse;
import com.example.sep490.dto.publicdto.PaymentResultResponse;
import com.example.sep490.entity.Invoice;
import com.example.sep490.entity.enums.*;
import com.example.sep490.repository.InvoiceRepository;
import com.example.sep490.service.DebtPaymentService;
import com.example.sep490.service.TransactionService;
import com.example.sep490.utils.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class InvoicePaymentStrategy implements PaymentStrategy {
    @Autowired
    private InvoiceRepository invoiceRepo;
    @Autowired
    private VNPayConfig vnPayConfig;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private DebtPaymentService debtPaymentService;

    @Override
    public PaymentResponse processPayment(HttpServletRequest request, long amount, String bankCode, Long invoiceId) {
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount * 100));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        String orderInfo = VNPayUtils.generateOrderInfo(PaymentType.INVOICE,invoiceId);
        vnpParamsMap.put("vnp_OrderInfo", orderInfo);
        vnpParamsMap.put("vnp_IpAddr", VNPayUtils.getIpAddress(request));

        Invoice invoice = invoiceRepo.findByIdAndIsDeleteFalse(invoiceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn."));
        vnpParamsMap.put("vnp_TmnCode", invoice.getOrder().getShop().getSecretA());
        vnpParamsMap.put("secretKey", invoice.getOrder().getShop().getSecretB());

        return generateResponse(vnpParamsMap);
    }

    @Transactional
    @Override
    public PaymentResultResponse handleWebHook(HttpServletRequest request) {
        String vnp_Amount = request.getParameter("vnp_Amount");
        String vnp_BankCode = request.getParameter("vnp_BankCode");
        String vnp_BankTranNo = request.getParameter("vnp_BankTranNo");
        String vnp_CardType = request.getParameter("vnp_CardType");
        String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
        String vnp_PayDate = request.getParameter("vnp_PayDate");
        String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");

        TransactionRequest newTransaction = TransactionRequest.builder()
                .amount(BigDecimal.ONE)
                .content(vnp_OrderInfo)
                .bankCode(vnp_BankCode)
                .transactionId(vnp_TransactionNo)
                .paymentDate(LocalDateTime.now())
                .paymentProvider(PaymentProvider.VNPAY)
                .paymentType(PaymentType.INVOICE)
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

        Long invoiceId = Long.parseLong(parts[1]);
        Invoice invoice = invoiceRepo.findByIdAndIsDeleteFalse(invoiceId).orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn."));
        DebtPaymentRequest newDebtPaymentRequest = DebtPaymentRequest.builder()
                .amountPaid(new BigDecimal(vnp_Amount))
                .invoiceId(invoiceId)
                .paymentDate(LocalDateTime.now())
                .build();
        DebtPaymentResponse debtPayment = debtPaymentService.createDebtPayment(newDebtPaymentRequest);
        newTransaction.setDebtPaymentId(debtPayment.getId());

        //Lưu transaction
        transactionService.createTransaction(newTransaction);

        PaymentResultResponse result = PaymentResultResponse.builder()
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

    public PaymentResponse generateResponse(Map<String, String> vnpParamsMap) {
        String queryUrl = VNPayUtils.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtils.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtils.hmacSHA512(vnpParamsMap.get("secretKey"), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentResponse.builder().code("ok").message("success").paymentUrl(paymentUrl).build();
    }
}
