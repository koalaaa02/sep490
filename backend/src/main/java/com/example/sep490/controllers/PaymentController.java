package com.example.sep490.controllers;
import com.example.sep490.dto.publicdto.PaymentResultDTO;
import com.example.sep490.services.payment.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    @GetMapping("/vn-pay")
    public ResponseEntity<?> pay(HttpServletRequest request, @RequestParam("amount") long amount, @RequestParam("bankCode") String bankCode) {
        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode));
    }
    @GetMapping("/vn-pay-callback")//ResponseObject<PaymentDTO.VNPayResponse>
    public ResponseEntity<?> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if (status.equals("00")) {
            String vnp_Amount = request.getParameter("vnp_Amount");
            String vnp_BankCode = request.getParameter("vnp_BankCode");
            String vnp_BankTranNo = request.getParameter("vnp_BankTranNo");
            String vnp_CardType = request.getParameter("vnp_CardType");
            String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
            String vnp_PayDate = request.getParameter("vnp_PayDate");
            String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");
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
            return ResponseEntity.ok().body(result);
        } else {
            return ResponseEntity.badRequest().body("Payment failed");
        }
    }
}