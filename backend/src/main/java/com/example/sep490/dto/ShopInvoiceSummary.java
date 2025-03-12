package com.example.sep490.dto;

import java.math.BigDecimal;

public interface ShopInvoiceSummary {
    Long getId();
    String getName();
    BigDecimal getTotalAmount();
    BigDecimal getPaidAmount();
}

