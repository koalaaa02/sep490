package com.example.sep490.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class FinancialReportResponse {
    private BigDecimal revenue;       // Doanh số
    private BigDecimal totalExpenses; // Tổng chi phí
    private BigDecimal vat;           // Thuế VAT
    private BigDecimal profit;        // Lợi nhuận
    private BigDecimal totalDebt;     // Tổng nợ cần thu (Hóa đơn)
    private BigDecimal totalPaidDebt; // Tổng nợ đã trả
}