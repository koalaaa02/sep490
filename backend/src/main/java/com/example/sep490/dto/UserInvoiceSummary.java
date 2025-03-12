package com.example.sep490.dto;

import java.math.BigDecimal;

public interface UserInvoiceSummary {
    Long getId();
    String getFirstName();
    String getLastName();
    BigDecimal getTotalAmount();
    BigDecimal getPaidAmount();
}

