package com.example.sep490.entity.compositeKeys;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderDetailId implements Serializable {
    private Long orderId;
    private Long skuId;

    public OrderDetailId() {}

    public OrderDetailId(Long orderId, Long skuId) {
        this.orderId = orderId;
        this.skuId = skuId;
    }

    // Getter và Setter
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getSkuId() {
        return skuId;
    }

    public void setSkuId(Long skuId) {
        this.skuId = skuId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderDetailId that = (OrderDetailId) o;
        return Objects.equals(orderId, that.orderId) && Objects.equals(skuId, that.skuId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, skuId);
    }
}
