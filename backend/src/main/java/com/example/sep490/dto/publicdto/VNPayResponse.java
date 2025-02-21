package com.example.sep490.dto.publicdto;

import lombok.Builder;

@Builder
public class VNPayResponse {
    public String code;
    public String message;
    public String paymentUrl;
}
