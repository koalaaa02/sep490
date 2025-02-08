package com.example.sep490.dto;

import java.math.BigDecimal;
import java.util.List;

import com.example.sep490.entities.Transaction;
import com.example.sep490.entities.enums.DeliveryMethod;
import com.example.sep490.entities.enums.OrderStatus;
import com.example.sep490.entities.enums.PaymentMethod;

import jakarta.annotation.Nullable;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
	private Long id;

    private OrderStatus status;
    
    private BigDecimal shippingFee;

    private BigDecimal totalAmount;
        
	@NotNull(message = "Phương thức thanh toán không được để trống.")
    private PaymentMethod paymentMethod; // CARD, COD

    private DeliveryMethod deliveryMethod = DeliveryMethod.GHN;

    private Long shopId;

    private Long transactionId;

    private Long addressId;
    
    @Nullable
    private String deliveryCode;

    @NotNull(message = "Bạn chưa chọn sản phẩm nào để tạo đơn.")
    private List<Long> productIds;
}
