package com.example.sep490.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.OrderDetail;
import com.example.sep490.entities.compositeKeys.OrderDetailId;

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