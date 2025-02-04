package com.example.sep490.entities;

import com.example.sep490.entities.compositeKeys.OrderDetailId;

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

@Entity
public class OrderDetail {
	@EmbeddedId
    private OrderDetailId id;

	@NotNull
    @ManyToOne
    @MapsId("orderId") // Ánh xạ orderId từ khóa chính
    @JoinColumn(name = "order_id")
    private Order order;

    @NotNull // Đảm bảo không null khi validate object trong Java
    @ManyToOne
    @MapsId("skuId") // Ánh xạ skuId từ khóa chính
    @JoinColumn(name = "sku_id", nullable = false) // Đảm bảo không null ở cấp CSDL
    private ProductSku productSku;
    

    private int quantity;
    private double price;
}
