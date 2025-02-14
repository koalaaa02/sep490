package com.example.sep490.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entities.enums.DeliveryMethod;
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
import org.hibernate.annotations.ColumnDefault;

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

//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user; // Một đơn hàng thuộc về một customer

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private BigDecimal shippingFee;

    private BigDecimal totalAmount;
        
    @OneToMany(mappedBy = "order")
    private List<OrderDetail> orderDetails;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // CARD, COD, DEBT, DEAL

    @ColumnDefault("'GHN'")
    @Enumerated(EnumType.STRING)
    private DeliveryMethod deliveryMethod; // GHN, TRUCK

    @OneToOne(mappedBy = "order")
    private Transaction transaction;

    @OneToOne(mappedBy = "order")
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop; // Một đơn hàng thuộc về một shop

    @Nullable
    private String deliveryCode;//mã vận chuyển để tra cứu tình trạng đơn hàng

    private LocalDateTime shippedDate; // Ngày hoàn thành đơn hàng

    private BigDecimal commissionFee;  // Phí hoa hồng sàn
    private BigDecimal paymentFee;     // Phí thanh toán
    private BigDecimal totalPlatformFee; // Tổng phí sàn cho đơn hàng
}
