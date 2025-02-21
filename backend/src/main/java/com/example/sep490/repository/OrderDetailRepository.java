package com.example.sep490.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.OrderDetail;
import com.example.sep490.entity.compositeKeys.OrderDetailId;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailId>{
    Page<OrderDetail> findByIsDeleteFalse(Pageable pageable);
    Optional<OrderDetail> findByIdAndIsDeleteFalse(OrderDetailId id);
    Page<OrderDetail> findByOrderIdAndIsDeleteFalse(Long orderId,Pageable pageable);
    List<OrderDetail> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
//public void deleteOrderDetail(Long orderId, Long skuId) {
//    orderDetailRepository.deleteById(new OrderDetailId(orderId, skuId));
//}
//public Optional<OrderDetail> findOrderDetail(Long orderId, Long skuId) {
//    return orderDetailRepository.findById(new OrderDetailId(orderId, skuId));
//}