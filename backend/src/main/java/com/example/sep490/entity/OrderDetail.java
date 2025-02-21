package com.example.sep490.entity;

import java.math.BigDecimal;
import java.util.List;

import com.example.sep490.entity.compositeKeys.OrderDetailId;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetail  extends Auditable{//lưu chi tiết đơn hàng
	@EmbeddedId
    private OrderDetailId id;
    private int quantity;
    private BigDecimal price;


    // Relationship
	@NotNull
    @ManyToOne
    @MapsId("orderId") // Ánh xạ orderId từ khóa chính
    @JoinColumn(name = "order_id")
    private Order order;

    @NotNull // Đảm bảo không null khi validate object trong Java
    @ManyToOne
    @MapsId("skuId") // Ánh xạ skuId từ khóa chính
    @JoinColumn(name = "sku_id", nullable = false) // Đảm bảo không null ở cấp CSDL
    private ProductSKU productSku;
}
