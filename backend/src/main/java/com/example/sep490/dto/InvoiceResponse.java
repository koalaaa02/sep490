package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.Auditable;
import com.example.sep490.entity.DebtPayment;
import com.example.sep490.entity.Order;
import com.example.sep490.entity.User;
import com.example.sep490.entity.enums.InvoiceStatus;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse{
	private Long id;
    private String invoiceCode;

    @JsonIgnoreProperties({ "invoices", "addresses", "shop"})
    private User agent; // người Đại lý/customer nợ
    @JsonIgnoreProperties({ "orderDetails", "transaction", "invoice","address","shop"})
    private Order order;
    private BigDecimal totalAmount; //tổng nợ phải trả
    private BigDecimal paidAmount ; // Ban đầu = 0, khi đại lý trả sẽ tăng lên
    private InvoiceStatus status = InvoiceStatus.UNPAID; // UNPAID, PARTIALLY_PAID, PAID
    private LocalDateTime deliveryDate;
    private String deliveryProofImage;
    private String deliveryNote;

    @JsonIgnoreProperties({ "invoice"})
    private List<DebtPayment> debtPayments;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
