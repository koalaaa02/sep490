package com.example.sep490.dto.GHN;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ShippingOrderFeeRequest {
    @Schema(defaultValue = "2")
    private int service_type_id;
    @Schema(defaultValue = "3440")
    private int from_district_id;
    @Schema(defaultValue = "13010")
    private String from_ward_code;
    @Schema(defaultValue = "2004")
    private int to_district_id;
    @Schema(defaultValue = "1B2021")
    private String to_ward_code;
    @Schema(defaultValue = "30")
    private int length;
    @Schema(defaultValue = "40")
    private int width;
    @Schema(defaultValue = "20")
    private int height;
    @Schema(defaultValue = "5000")
    private int weight;
    @Schema(defaultValue = "1000000")
    private long insurance_value;
    @Schema(defaultValue = "null")
    private Object coupon;
}
