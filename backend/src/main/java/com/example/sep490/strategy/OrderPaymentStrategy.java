package com.example.sep490.strategy;

import com.example.sep490.configs.VNPayConfig;
import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.dto.publicdto.PaymentResponse;
import com.example.sep490.dto.publicdto.PaymentResultResponse;
import com.example.sep490.entity.Order;
import com.example.sep490.entity.enums.*;
import com.example.sep490.repository.OrderRepository;
import com.example.sep490.service.TransactionService;
import com.example.sep490.utils.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class OrderPaymentStrategy implements PaymentStrategy {
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private VNPayConfig vnPayConfig;
    @Autowired
    private TransactionService transactionService;

    @Override
    public PaymentResponse processPayment(HttpServletRequest request, long amount, String bankCode, Long orderId) {
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount * 100));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        String orderInfo = VNPayUtils.generateOrderInfo(PaymentType.ORDER,orderId);
        vnpParamsMap.put("vnp_OrderInfo", orderInfo);
        vnpParamsMap.put("vnp_IpAddr", VNPayUtils.getIpAddress(request));

        Order order = orderRepo.findByIdAndIsDeleteFalse(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng."));
        vnpParamsMap.put("vnp_TmnCode", order.getShop().getSecretA());

        String queryUrl = VNPayUtils.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtils.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtils.hmacSHA512(order.getShop().getSecretB(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentResponse.builder().code("ok").message("success").paymentUrl(paymentUrl).build();
//        return generateResponse(vnpParamsMap);
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
                .amount(new BigDecimal(vnp_Amount).divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN))
                .content(vnp_OrderInfo)
                .bankCode(vnp_BankCode)
                .transactionId(vnp_TransactionNo)
                .paymentDate(LocalDateTime.now())
                .paymentProvider(PaymentProvider.VNPAY)
                .paymentType(PaymentType.ORDER)
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

        Long orderId = Long.parseLong(parts[1]);
        Order order = orderRepo.findByIdAndIsDeleteFalse(orderId).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng."));
        order.setPaid(true);
        orderRepo.save(order);

        newTransaction.setOrderId(orderId);

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
