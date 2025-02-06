package com.example.sep490.entities;

import java.math.BigDecimal;
import java.util.List;

import com.example.sep490.entities.enums.InvoiceStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice  extends Auditable{//hóa đơn nợ cho đơn hàng nào (nếu đơn hàng đó được seller tạo, còn đơn customer tự đặt sẽ không có invoice)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent; // người Đại lý nợ

    private BigDecimal totalAmount; //tổng nợ
    
    private BigDecimal paidAmount = BigDecimal.ZERO;; // Ban đầu = 0, khi đại lý trả sẽ tăng lên

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status; // UNPAID, PARTIALLY_PAID, PAID

    @OneToMany(mappedBy = "invoice")
    private List<DebtPayment> debtPayments;
}
