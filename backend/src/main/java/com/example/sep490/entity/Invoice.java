package com.example.sep490.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.enums.InvoiceStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice  extends Auditable{//hóa đơn nợ cho đơn hàng nào (nếu đơn hàng đó được seller tạo, còn đơn customer tự đặt sẽ không có invoice)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 10, unique = true)
    private String invoiceCode;

    private BigDecimal totalAmount; //tổng nợ phải trả
    private BigDecimal paidAmount = BigDecimal.ZERO; // Ban đầu = 0, khi đại lý trả sẽ tăng lên

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status = InvoiceStatus.UNPAID;; // UNPAID, PARTIALLY_PAID, PAID
    private LocalDateTime deliveryDate;
    private String deliveryProofImage;
    private String deliveryNote;

    // Relationship
    @OneToMany(mappedBy = "invoice")
    private List<DebtPayment> debtPayments;
    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent; // người Đại lý nợ
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}
