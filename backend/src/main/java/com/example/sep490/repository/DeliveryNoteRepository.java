package com.example.sep490.repository;

import com.example.sep490.entity.DeliveryNote;
import com.example.sep490.entity.Order;
import com.example.sep490.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DeliveryNoteRepository extends JpaRepository<DeliveryNote, Long>, JpaSpecificationExecutor<DeliveryNote> {
    Page<DeliveryNote> findByIsDeleteFalse(Pageable pageable);
    Optional<DeliveryNote> findByIdAndIsDeleteFalse(Long id);

//    @Query("SELECT d FROM DeliveryNote d WHERE d.order.id = :orderId")
//    List<DeliveryNote> findByOrderIdAndIsDeleteFalse(Long id);



}
