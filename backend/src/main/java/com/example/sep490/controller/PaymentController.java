package com.example.sep490.controller;
import com.example.sep490.adapter.PaymentMethod;
import com.example.sep490.dto.publicdto.PaymentResultResponse;
import com.example.sep490.entity.enums.PaymentProvider;
import com.example.sep490.entity.enums.PaymentType;
import com.example.sep490.factory.PaymentFactory;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("${spring.application.api-prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentFactory paymentFactory;

    @GetMapping("/pay")
    public ResponseEntity<?> pay(HttpServletRequest request
            , @RequestParam("paymentProvider") PaymentProvider paymentProvider
            , @RequestParam("paymentType") PaymentType paymentType
            , @RequestParam("amount") long amount
            , @RequestParam(value = "bankCode", required = false) String bankCode
            , @RequestParam("referenceId") Long referenceId) {
        PaymentMethod paymentMethod = paymentFactory.getPaymentMethod(paymentProvider);
        return ResponseEntity.ok(paymentMethod.pay(request, paymentType, bankCode, amount, referenceId));
    }

    @GetMapping("/vn-pay-callback")//ResponseObject<PaymentDTO.VNPayResponse>
    public String payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if (status.equals("00")) {
            PaymentMethod paymentMethod = paymentFactory.getPaymentMethod(PaymentProvider.VNPAY);
            PaymentResultResponse result=  paymentMethod.handleWebHook(request);
            return "redirect:http://localhost:3000/payment-result?result=success"
                    + "&vnp_Amount="+ result.getVnp_Amount()
                    + "&vnp_BankCode=" + result.getVnp_BankCode()
                    + "&vnp_TransactionNo=" + result.getVnp_TransactionNo();
        } else {
            return "redirect:http://localhost:3000/payment-result?result=fail";
        }
    }

    @GetMapping("/vn-pay-test")
    public String payCallbackHandddler(HttpServletRequest request) {
        return "redirect:http://localhost:3000?";
    }
}



//    @GetMapping("/vn-pay/order")
//    public ResponseEntity<?> payOrder(HttpServletRequest request
//            , @RequestParam("amount") long amount
//            , @RequestParam("bankCode") String bankCode
//            , @RequestParam("orderId") Long orderId) {
//        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,PaymentType.ORDER, orderId));
//    }
//
//    @GetMapping("/vn-pay/invoice")
//    public ResponseEntity<?> payInvoice(HttpServletRequest request
//            , @RequestParam("amount") long amount
//            , @RequestParam("bankCode") String bankCode
//            , @RequestParam("paymenType") Long invoiceId) {
//        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,PaymentType.INVOICE,invoiceId));
//    }
//
//    @GetMapping("/vn-pay/fee")
//    public ResponseEntity<?> payFee(HttpServletRequest request
//            , @RequestParam("amount") long amount
//            , @RequestParam("bankCode") String bankCode
//            , @RequestParam("paymenType") Long shopId) {
//        return ResponseEntity.ok().body(paymentService.createVnPayPayment(request,amount,bankCode,PaymentType.PLATFORM_FEE,shopId));
//    }