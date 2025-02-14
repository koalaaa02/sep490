package com.example.sep490.repositories;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import com.example.sep490.entities.Product;
import com.example.sep490.entities.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Order;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findByIsDeleteFalse(Pageable pageable);
    List<Order> findByCreatedByAndIsDeleteFalse(Long userId);
	Optional<Order> findByIdAndIsDeleteFalse(Long id);
    List<Order> findByShopIdAndIsDeleteFalse(Long shopId);

    //order statistic
    @Query("SELECT MONTH(o.createdAt) as month, COUNT(o) as totalOrders " +
            "FROM Order o WHERE o.shop.id = :sellerId AND YEAR(o.createdAt) = :year " +
            "GROUP BY MONTH(o.createdAt)")
    List<Object[]> getOrderStatisticsByYear(Long sellerId, Integer year);

    @Query("SELECT DAY(o.createdAt) as day, COUNT(o) as totalOrders " +
            "FROM Order o WHERE o.shop.id = :sellerId AND YEAR(o.createdAt) = :year " +
            "AND MONTH(o.createdAt) = :month GROUP BY DAY(o.createdAt)")
    List<Object[]> getOrderStatisticsByMonth(Long sellerId, Integer month, Integer year);

    //cal revenue
    List<Order> findByStatusAndCreatedAtBetween(OrderStatus status, LocalDateTime start, LocalDateTime end);

    //cal totalPlatformFee
    @Query("SELECT COALESCE(SUM(o.totalPlatformFee), 0) FROM Order o " +
            "WHERE o.shop.id = :shopId " +
            "AND o.status = 'DELIVERED' " +
            "AND FUNCTION('YEAR', o.shippedDate) = :year " +
            "AND FUNCTION('MONTH', o.shippedDate) = :month")
    BigDecimal getTotalPlatformFeeByShopAndMonth(@Param("shopId") Long shopId,
                                                 @Param("year") int year,
                                                 @Param("month") int month);


}
