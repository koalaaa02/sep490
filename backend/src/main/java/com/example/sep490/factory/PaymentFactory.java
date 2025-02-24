package com.example.sep490.factory;

import com.example.sep490.adapter.MomoAdapter;
import com.example.sep490.adapter.PaymentMethod;
import com.example.sep490.adapter.VNPayAdapter;
import com.example.sep490.entity.enums.PaymentProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentFactory {
    @Autowired
    private VNPayAdapter vNPayAdapter;
    @Autowired
    private MomoAdapter momoAdapter;

    public PaymentMethod getPaymentMethod(PaymentProvider provider) {
        switch (provider) {
            case VNPAY:
                return vNPayAdapter;
            case MOMO:
                return momoAdapter;
            default:
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
        }
    }
}
