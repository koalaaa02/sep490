package com.example.sep490.dto.GHN;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
public class ShippingOrderFeeResponse {
    private int code;
    private String message;
    private ShippingFeeData data;

    @Data
    public static class ShippingFeeData {
        private int total;
        private int service_fee;
        private int insurance_fee;
        private int pick_station_fee;
        private int coupon_value;
        private int r2s_fee;
        private int return_again;
        private int document_return;
        private int double_check;
        private int cod_fee;
        private int pick_remote_areas_fee;
        private int deliver_remote_areas_fee;
        private int cod_failed_fee;
    }
}
