package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.OrderDetail;
import com.example.sep490.entities.compositeKeys.OrderDetailId;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailId>{
    List<OrderDetail> findByIsDeleteFalse();
    Optional<OrderDetail> findByIdAndIsDeleteFalse(OrderDetailId id);	
}
//public void deleteOrderDetail(Long orderId, Long skuId) {
//    orderDetailRepository.deleteById(new OrderDetailId(orderId, skuId));
//}
//public Optional<OrderDetail> findOrderDetail(Long orderId, Long skuId) {
//    return orderDetailRepository.findById(new OrderDetailId(orderId, skuId));
//}