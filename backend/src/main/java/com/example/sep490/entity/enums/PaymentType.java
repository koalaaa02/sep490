package com.example.sep490.entity.enums;

public enum PaymentType {
    ORDER, PLATFORM_FEE, INVOICE;

    public static PaymentType fromString(String value) {
        try {
            return PaymentType.valueOf(value);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
