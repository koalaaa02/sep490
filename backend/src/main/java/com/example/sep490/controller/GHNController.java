package com.example.sep490.controller;

import com.example.sep490.dto.GHN.*;
import com.example.sep490.service.GHN.GHNService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ghn")
public class GHNController {
    @Autowired
    private GHNService ghnService;

    @GetMapping("/provinces")
    public ResponseEntity<List<ProvinceDTO>> getProvinces() {
        List<ProvinceDTO> provinces = ghnService.getProvinces();
        return ResponseEntity.ok(provinces);
    }

    @GetMapping("/districts")
    public ResponseEntity<List<DistrictDTO>> getDistrictsByProvince(@RequestParam int provinceId) {
        List<DistrictDTO> districts = ghnService.getDistrictsByProvinceId(provinceId);
        return ResponseEntity.ok(districts);
    }

    @GetMapping("/wards")
    public ResponseEntity<List<WardDTO>> getWardsByDistrict(@RequestParam int districtId) {
        List<WardDTO> wards = ghnService.getWardsByDistrictId(districtId);
        return ResponseEntity.ok(wards);
    }

    @PostMapping("/shipping-fee")
    public ShippingOrderFeeResponse getShippingFee(@RequestBody ShippingOrderFeeRequest requestDTO) {
        return ghnService.getShippingFee(requestDTO);
    }
}
