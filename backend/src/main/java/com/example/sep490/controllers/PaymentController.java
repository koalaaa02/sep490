package com.example.sep490.controllers;
import com.example.sep490.dto.TransactionRequest;
import com.example.sep490.dto.TransactionResponse;
import com.example.sep490.dto.publicdto.PaymentDTO;
import com.example.sep490.dto.publicdto.PaymentResultDTO;
import com.example.sep490.entities.Order;
import com.example.sep490.entities.Transaction;
import com.example.sep490.entities.enums.PaymentMethod;
import com.example.sep490.entities.enums.PaymentType;
import com.example.sep490.entities.enums.TransactionStatus;
import com.example.sep490.entities.enums.TransactionType;
import com.example.sep490.services.TransactionService;
import com.example.sep490.services.payment.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("${spring.application.api-prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final VNPayService paymentService;
    private final TransactionService transactionService;


    @GetMapping("/vn-pay/order")
    public ResponseEntity<?> payOrder(HttpServletRequest request, @RequestParam("amount") long amount, @RequestParam("bankCode") String bankCode, @RequestParam("orderId") Long orderId) {
        String orderInfo = paymentService.generateOrderInfo(PaymentType.ORDER,orderId);
        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,orderInfo));
    }

    @GetMapping("/vn-pay/invoice")
    public ResponseEntity<?> payInvoice(HttpServletRequest request, @RequestParam("amount") long amount, @RequestParam("bankCode") String bankCode, @RequestParam("paymenType") Long invoiceId) {
        String orderInfo = paymentService.generateOrderInfo(PaymentType.INVOICE,invoiceId);
        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,orderInfo));
    }

    @GetMapping("/vn-pay/fee")
    public ResponseEntity<?> payFee(HttpServletRequest request, @RequestParam("amount") long amount, @RequestParam("bankCode") String bankCode, @RequestParam("paymenType") String shopId) {
        String orderInfo = paymentService.generateOrderInfo(PaymentType.PLATFORM_FEE,shopId);
        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,orderInfo));
    }

    @GetMapping("/vn-pay-callback")//ResponseObject<PaymentDTO.VNPayResponse>
    public ResponseEntity<?> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if (status.equals("00")) {
            PaymentResultDTO result=  paymentService.handleVnPayPayment(request);
            return ResponseEntity.ok().body(result);
        } else {
            return ResponseEntity.badRequest().body("Payment failed");
        }
    }
}