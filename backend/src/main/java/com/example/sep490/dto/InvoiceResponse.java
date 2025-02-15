package com.example.sep490.dto;

import java.math.BigDecimal;
import java.util.List;

import com.example.sep490.entities.DebtPayment;
import com.example.sep490.entities.Order;
import com.example.sep490.entities.User;
import com.example.sep490.entities.enums.InvoiceStatus;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {
	private Long id;

    @JsonIgnoreProperties({ "invoices", "addresses", "shop"})
    private User agent; // người Đại lý/customer nợ
    @JsonIgnoreProperties({ "orderDetails", "transaction", "invoice","address","shop"})
    private Order order;

    private BigDecimal totalAmount; //tổng nợ phải trả
    
    private BigDecimal paidAmount ; // Ban đầu = 0, khi đại lý trả sẽ tăng lên

    private InvoiceStatus status = InvoiceStatus.UNPAID; // UNPAID, PARTIALLY_PAID, PAID

    @JsonIgnoreProperties({ "invoice"})
    private List<DebtPayment> debtPayments;
}
