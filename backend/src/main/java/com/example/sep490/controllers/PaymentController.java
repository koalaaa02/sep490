package com.example.sep490.controllers;
import com.example.sep490.dto.publicdto.PaymentResultDTO;
import com.example.sep490.entities.enums.PaymentType;
import com.example.sep490.services.TransactionService;
import com.example.sep490.services.payment.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${spring.application.api-prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final VNPayService paymentService;
    private final TransactionService transactionService;


    @GetMapping("/vn-pay/order")
    public ResponseEntity<?> payOrder(HttpServletRequest request
            , @RequestParam("amount") long amount
            , @RequestParam("bankCode") String bankCode
            , @RequestParam("orderId") Long orderId) {
        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,PaymentType.ORDER, orderId));
    }

    @GetMapping("/vn-pay/invoice")
    public ResponseEntity<?> payInvoice(HttpServletRequest request
            , @RequestParam("amount") long amount
            , @RequestParam("bankCode") String bankCode
            , @RequestParam("paymenType") Long invoiceId) {
        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,PaymentType.INVOICE,invoiceId));
    }

    @GetMapping("/vn-pay/fee")
    public ResponseEntity<?> payFee(HttpServletRequest request
            , @RequestParam("amount") long amount
            , @RequestParam("bankCode") String bankCode
            , @RequestParam("paymenType") Long shopId) {
        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,PaymentType.PLATFORM_FEE,shopId));
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