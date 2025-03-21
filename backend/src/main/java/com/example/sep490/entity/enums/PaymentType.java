package com.example.sep490.entity.enums;

public enum PaymentType {
    ORDER, PLATFORMFEE, INVOICE;

    public static PaymentType fromString(String value) {
        try {
            return PaymentType.valueOf(value);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
