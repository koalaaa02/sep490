package com.example.sep490.entity;

import com.example.sep490.entity.compositeKeys.OrderDetailId;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tbl_delivery_detail")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryDetail extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productName;
    private String productSKUCode;
    private String unit;
    private int quantity;
    private BigDecimal price; // Giá tại thời điểm giao hàng

    @ManyToOne
    @JoinColumn(name = "delivery_note_id")
    private DeliveryNote deliveryNote;

    private OrderDetailId orderDetailId; // Mặt hàng gốc từ đơn hàng
}
