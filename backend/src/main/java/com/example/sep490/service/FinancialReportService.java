package com.example.sep490.service;

import com.example.sep490.dto.FinancialReportResponse;
import com.example.sep490.entity.Expense;
import com.example.sep490.entity.Invoice;
import com.example.sep490.entity.Order;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.repository.ExpenseRepository;
import com.example.sep490.repository.InvoiceRepository;
import com.example.sep490.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancialReportService {
    private final OrderRepository orderRepository;
    private final ExpenseRepository expenseRepository;
    private final InvoiceRepository invoiceRepository;

    private static final BigDecimal VAT_RATE = BigDecimal.valueOf(0.1);  // 10%

    /**
     * Generate financial report for a specific month and year.
     *
     * @param month - Month to calculate (1-12)
     * @param year  - Year to calculate
     * @return FinancialReportResponse containing revenue, expenses, profit, etc.
     */
    public FinancialReportResponse generateReport(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        // Calculate Revenue (Total Orders for the month)
        List<Order> orders = orderRepository.findByStatusAndCreatedAtBetween(
                OrderStatus.DELIVERED, startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        BigDecimal revenue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate Total Expenses
        List<Expense> expenses = expenseRepository.findByCreatedAtBetween(
                startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate VAT for the revenue
        BigDecimal vat = revenue.multiply(VAT_RATE);

        // Profit = Revenue - Total Expenses - VAT
        BigDecimal profit = revenue.subtract(totalExpenses).subtract(vat);

        // Fetch Outstanding Invoices
        List<Invoice> invoices = invoiceRepository.findByCreatedAtBetween(
                startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        BigDecimal totalDebt = invoices.stream()
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaidDebt = invoices.stream()
                .map(Invoice::getPaidAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Response
        return new FinancialReportResponse(revenue, totalExpenses, vat, profit, totalDebt, totalPaidDebt);
    }
}