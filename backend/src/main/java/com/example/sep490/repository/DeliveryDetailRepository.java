package com.example.sep490.repository;

import com.example.sep490.entity.Address;
import com.example.sep490.entity.DeliveryDetail;
import com.example.sep490.entity.DeliveryNote;
import com.example.sep490.entity.OrderDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DeliveryDetailRepository extends JpaRepository<DeliveryDetail, Long>, JpaSpecificationExecutor<DeliveryDetail> {
    Page<DeliveryDetail> findByIsDeleteFalse(Pageable pageable);
    Optional<DeliveryDetail> findByIdAndIsDeleteFalse(Long id);
    @Query("SELECT d FROM DeliveryDetail d WHERE d.orderDetailId.orderId = :orderId")
    List<DeliveryDetail> findByOrderIdAndIsDeleteFalse(Long orderId);

    @Modifying
    @Transactional
    @Query(value = "CALL UpdateTotalAmountByDeliveryNoteId(:id)", nativeQuery = true)
    void updateTotalAmountByDeliveryNoteId(@Param("id") Long deliveryNoteId);
}
