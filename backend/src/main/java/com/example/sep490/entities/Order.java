package com.example.sep490.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entities.enums.OrderStatus;
import com.example.sep490.entities.enums.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "`Order`")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order  extends Auditable{//đơn hàng nè
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Một đơn hàng thuộc về một customer

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop; // Một đơn hàng thuộc về một shop
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private BigDecimal shippingFee;

    private BigDecimal totalAmount;
        
    @OneToMany(mappedBy = "order")
    private List<OrderDetail> orderDetails;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // CARD, COD
    
    @OneToOne(mappedBy = "order")
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "shipping_address_id")
    private ShippingAddress shippingAddress; 
    
    @Nullable
    private String deliveryCode;//mã vận chuyển để tra cứu tình trạng đơn hàng
    
    
}
