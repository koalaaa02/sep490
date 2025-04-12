package com.example.sep490.service.GHN;

import com.example.sep490.common.WebClientComponent;
import com.example.sep490.dto.GHN.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GHNService {
    @Autowired
    private WebClientComponent webClientComponent;
    @Value("${ghn.api.base-url}")
    private String GHN_BASE_URL;
    @Value("${ghn.api.token}")
    private String TOKEN;
    @Value("${ghn.api.shopId}")
    private String SHOPID;

    public List<ProvinceDTO> getProvinces() {
        String url = GHN_BASE_URL + "/master-data/province";

        Map<String, String> headers = new HashMap<>();
        headers.put("Token", TOKEN);

        GHNProvinceResponse response = webClientComponent.get(url, headers, GHNProvinceResponse.class);

        if (response != null && response.getCode() == 200) {
            return response.getData();
        } else {
            throw new RuntimeException("GHN API error: " + (response != null ? response.getMessage() : "Unknown error"));
        }
    }

    public List<DistrictDTO> getDistrictsByProvinceId(int provinceId) {
        String url = GHN_BASE_URL + "/master-data/district?province_id=" + provinceId;

        Map<String, String> headers = Map.of("Token", TOKEN);

        GHNDistrictResponse response = webClientComponent.get(url, headers, GHNDistrictResponse.class);

        if (response != null && response.getCode() == 200) {
            return response.getData();
        } else {
            throw new RuntimeException("GHN API error: " + (response != null ? response.getMessage() : "Unknown error"));
        }
    }

    public List<WardDTO> getWardsByDistrictId(int districtId) {
        String url = GHN_BASE_URL + "/master-data/ward?district_id=" + districtId;

        Map<String, String> headers = Map.of("Token", TOKEN);

        GHNWardResponse response = webClientComponent.get(url, headers, GHNWardResponse.class);

        if (response != null && response.getCode() == 200) {
            return response.getData();
        } else {
            throw new RuntimeException("GHN API error: " + (response != null ? response.getMessage() : "Unknown error"));
        }
    }

    public ShippingOrderFeeResponse getShippingFee(ShippingOrderFeeRequest requestDTO) {
        String url = GHN_BASE_URL + "/v2/shipping-order/fee";
        Map<String, String> headers = new HashMap<>();
        headers.put("Token", TOKEN);
        headers.put("shopId", SHOPID);
        return webClientComponent.post(url, requestDTO, headers, ShippingOrderFeeResponse.class);
    }
}
