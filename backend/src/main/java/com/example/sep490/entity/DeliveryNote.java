package com.example.sep490.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tbl_delivery_note")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryNote extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deliveryCode; // Mã giao hàng riêng biệt
    private LocalDateTime deliveredDate;
    private BigDecimal totalAmount;
    private boolean delivered;
    private boolean paid;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order; // Đơn hàng mẹ

    @OneToMany(mappedBy = "deliveryNote", cascade = CascadeType.ALL)
    private List<DeliveryDetail> deliveryDetails; // Sản phẩm trong phiếu giao
}
