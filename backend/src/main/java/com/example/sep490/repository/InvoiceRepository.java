package com.example.sep490.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.sep490.dto.ShopInvoiceSummary;
import com.example.sep490.dto.UserInvoiceSummary;
import com.example.sep490.entity.ChatRoom;
import com.example.sep490.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.Invoice;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvoiceRepository extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {
    Page<Invoice> findByIsDeleteFalse(Pageable pageable);
	Optional<Invoice> findByIdAndIsDeleteFalse(Long id);
    //cal revenue
    List<Invoice> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query(value = """
        SELECT s.id AS id,
               s.name AS name,
               SUM(iv.totalAmount) AS totalAmount,
               SUM(iv.paidAmount) AS paidAmount
        FROM tbl_order o
        INNER JOIN tbl_invoice iv ON o.id = iv.order_id AND iv.agent_id = :agent_id
        INNER JOIN tbl_shop s ON s.id = o.shop_id
        GROUP BY o.shop_id
    """, nativeQuery = true)
    List<ShopInvoiceSummary> findAllShopAndCountInvoiceByAgentID(@Param("agent_id") Long agent_id);


    @Query(value = """
        SELECT u.id AS id,
                u.firstName AS firstName,
                u.lastName AS lastName,
                SUM(iv.totalAmount) AS totalAmount,
                SUM(iv.paidAmount) AS paidAmount
        FROM tbl_user u
        INNER JOIN tbl_invoice iv ON u.id = iv.agent_id AND iv.created_by = :created_by
        GROUP BY u.id, u.lastName, u.firstName;
    """, nativeQuery = true)
    List<UserInvoiceSummary> findAllUserAndCountInvoiceByCreatedBy(@Param("created_by") Long created_by);

    @Query(value = """
        SELECT iv.*
        FROM sep490v3.tbl_order o
        INNER JOIN tbl_invoice iv ON o.id = iv.order_id AND iv.agent_id = :agent_id
        INNER JOIN tbl_shop s ON s.id = o.shop_id AND o.shop_id = :shop_id
    """, nativeQuery = true)
    List<Invoice> findByShopIdAndAgentId(@Param("shop_id") Long shop_id, @Param("agent_id") Long agent_id);

}