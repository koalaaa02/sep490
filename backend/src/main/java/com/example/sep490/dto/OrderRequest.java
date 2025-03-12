package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.Transaction;
import com.example.sep490.entity.enums.DeliveryMethod;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.entity.enums.PaymentMethod;

import io.swagger.v3.oas.annotations.media.Schema;
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

    @NotNull(message = "Trạng thái đơn hàng không được để trống.")
    private OrderStatus status;
    
    private BigDecimal shippingFee;

    private BigDecimal totalAmount;
        
	@NotNull(message = "Phương thức thanh toán không được để trống.")
    private PaymentMethod paymentMethod; // VNPAY, MOMO, COD,DEBT

    private DeliveryMethod deliveryMethod = DeliveryMethod.GHN;

    @Schema(defaultValue = "false")
    private boolean paid = false;


    // Relationship
    private Long shopId;

//    private Long transactionId;

    private Long addressId;
    
    @Nullable
    private String deliveryCode;

    @NotNull(message = "Bạn chưa chọn sản phẩm nào để tạo đơn.")
    private List<Long> productIds;

    private BigDecimal commissionFee;  // Phí hoa hồng sàn
    private BigDecimal paymentFee;     // Phí thanh toán
    private BigDecimal totalPlatformFee; // Tổng phí sàn cho đơn hàng
}
