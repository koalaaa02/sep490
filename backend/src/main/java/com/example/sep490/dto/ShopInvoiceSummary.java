package com.example.sep490.dto;

import java.math.BigDecimal;

public interface ShopInvoiceSummary {
    Long getShopId();
    String getShopName();
    BigDecimal getTotalAmount();
    BigDecimal getPaidAmount();
    BigDecimal getPaidPercentage();
}

