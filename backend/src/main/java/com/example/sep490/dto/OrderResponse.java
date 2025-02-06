package com.example.sep490.dto;

import java.math.BigDecimal;
import java.util.List;

import com.example.sep490.entities.OrderDetail;
import com.example.sep490.entities.ShippingAddress;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.Transaction;
import com.example.sep490.entities.User;
import com.example.sep490.entities.enums.OrderStatus;
import com.example.sep490.entities.enums.PaymentMethod;

import jakarta.annotation.Nullable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
	private Long id;

    private User user; 

    private Shop shop; 
    
    private OrderStatus status;
    
    private BigDecimal shippingFee;

    private BigDecimal totalAmount;
        
    private List<OrderDetail> orderDetails;

    private PaymentMethod paymentMethod; // CARD, COD
    
    private Transaction transaction;

    private ShippingAddress shippingAddress; 
    
    @Nullable
    private String deliveryCode;//mã vận chuyển để tra cứu tình trạng đơn hàng
}
