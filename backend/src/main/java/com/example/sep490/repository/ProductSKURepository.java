package com.example.sep490.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.sep490.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.ProductSKU;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductSKURepository extends JpaRepository<ProductSKU, Long>, JpaSpecificationExecutor<ProductSKU> {
    Page<ProductSKU> findByIsDeleteFalse(Pageable pageable);
    @Query("SELECT p FROM ProductSKU p WHERE p.isDelete = false AND p.product.id = :productId")
    Page<ProductSKU> findByProductIdAndIsDeleteFalse(@Param("productId") Long productId, Pageable pageable);

    Optional<ProductSKU> findByIdAndIsDeleteFalse(Long id);
    @Query(value = "SELECT stock FROM tbl_productsku WHERE id = :productSKUId", nativeQuery = true)
    Integer getAvailableQuantity(@Param("productSKUId") Long productSKUId);

    List<ProductSKU> findByUpdatedAtBefore(LocalDateTime thresholdDate);

//    cal statistic
    List<ProductSKU> findByStockLessThanAndStockGreaterThan(int maxstock, int minstock);
    List<ProductSKU> findByStock(int stock);

    @Query(value = "SELECT sku.skuCode, SUM(oi.quantity) as total_sold " +
            "FROM tbl_order_detail oi INNER JOIN tbl_productsku sku ON oi.sku_id = sku.id " +
            "GROUP BY sku.skuCode ORDER BY total_sold DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> findTopSellingProducts(@Param("limit") int limit);

    @Query(value = "SELECT sku.skuCode, SUM(oi.quantity) as total_sold " +
            "FROM tbl_order_detail oi INNER JOIN tbl_productsku sku ON oi.sku_id = sku.id " +
            "GROUP BY sku.skuCode ORDER BY total_sold ASC LIMIT :limit", nativeQuery = true)
    List<Object[]> findLeastSellingProducts(@Param("limit") int limit);


}
