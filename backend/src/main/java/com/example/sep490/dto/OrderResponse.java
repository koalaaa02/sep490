package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entities.*;
import com.example.sep490.entities.enums.DeliveryMethod;
import com.example.sep490.entities.enums.OrderStatus;
import com.example.sep490.entities.enums.PaymentMethod;

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
    private OrderStatus status;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod; // CARD, COD
    private DeliveryMethod deliveryMethod;
    @Nullable
    private String deliveryCode;//mã vận chuyển để tra cứu tình trạng đơn hàng
    private LocalDateTime shippedDate; // Ngày hoàn thành đơn hàng
    private BigDecimal commissionFee;  // Phí hoa hồng sàn
    private BigDecimal paymentFee;     // Phí thanh toán
    private BigDecimal totalPlatformFee; // Tổng phí sàn cho đơn hàng

    @JsonIgnoreProperties( { "order", "productSku" })
    private List<OrderDetail> orderDetails;
    @JsonIgnoreProperties( { "order" })
    private Transaction transaction;
    @JsonIgnoreProperties( { "user","shop" })
    private Address address;
    @JsonIgnoreProperties( { "orders","manager","address","products" })
    private Shop shop;
    @JsonIgnoreProperties( { "order","agent","debtPayments"})
    private Invoice invoice;


}
