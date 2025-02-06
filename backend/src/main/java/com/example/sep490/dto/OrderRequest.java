package com.example.sep490.dto;

import java.math.BigDecimal;

import com.example.sep490.entities.Transaction;
import com.example.sep490.entities.enums.OrderStatus;
import com.example.sep490.entities.enums.PaymentMethod;

import jakarta.annotation.Nullable;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
	private Long id;

    private Long userId; 

    private Long shopId; 
    
    private OrderStatus status;
    
    private BigDecimal shippingFee;

    private BigDecimal totalAmount;
        
	@NotNull(message = "Phương thức thanh toán không được để trống.")
    private PaymentMethod paymentMethod; // CARD, COD
    
    private Transaction transaction;

    private Long shippingAddressId; 
    
    @Nullable
    private String deliveryCode;
}
