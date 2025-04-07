package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.*;
import com.example.sep490.entity.enums.DeliveryMethod;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.entity.enums.PaymentMethod;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    private String orderCode;

    private OrderStatus status;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod; // CARD, COD
    private DeliveryMethod deliveryMethod;
    @Nullable
    private String deliveryCode;//mã vận chuyển để tra cứu tình trạng đơn hàng
    private LocalDateTime orderDate; // Ngày order đơn hàng
    private LocalDateTime deliveryDate; // Ngày hoàn thành đơn hàng
    private boolean paid;

    private BigDecimal commissionFee;  // Phí hoa hồng sàn
    private BigDecimal paymentFee;     // Phí thanh toán
    private BigDecimal totalPlatformFee; // Tổng phí sàn cho đơn hàng

    @JsonIgnoreProperties( { "order" })
    private List<OrderDetailResponse> orderDetails;
    @JsonIgnoreProperties( { "order" })
    private Transaction transaction;
    @JsonIgnoreProperties( { "user","shop" })
    private Address address;
    @JsonIgnoreProperties( { "orders","manager","address","products" })
    private Shop shop;
    @JsonIgnoreProperties({"debtPayments","agent","order"})
    private Invoice invoice;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
