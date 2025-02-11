package com.example.sep490.controllers;

import com.example.sep490.entities.ProductSKU;
import com.example.sep490.services.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/order")
    @PreAuthorize( "hasAuthority('ROLE_SELLER')")
    public Map<String, Object> getOrderStatistics(@RequestParam Long sellerId) {
        return statisticsService.getOrderStatistics(sellerId);
    }

    @GetMapping("/order/period")
    @PreAuthorize( "hasAuthority('ROLE_SELLER')")
    public ResponseEntity<Map<String, Integer>> getOrderStatisticsPeriod(@RequestParam Long sellerId, @RequestParam(value = "month",required = false, defaultValue = "0") int month,@RequestParam(value = "year",required = false) int year ) {
        return ResponseEntity.ok().body(statisticsService.getOrderStatisticsByPeriod(sellerId,month, year));
    }


    @GetMapping("/product/inventory")
    @PreAuthorize( "hasAuthority('ROLE_SELLER')")
    public ResponseEntity<Map<String, Integer>> getInventoryStatistics() {
        return ResponseEntity.ok(statisticsService.getProductInventoryStatistics());
    }

    @GetMapping("/product/sales")
    @PreAuthorize( "hasAuthority('ROLE_SELLER')")
    public ResponseEntity<Map<String, Integer>> getSalesStatistics(
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to) {
        return ResponseEntity.ok(statisticsService.getProductSalesStatistics(from, to));
    }

    @GetMapping("/product/long-term")
    @PreAuthorize( "hasAuthority('ROLE_SELLER')")
    public ResponseEntity<List<ProductSKU>> getLongTermInventoryProducts(
            @RequestParam int daysThreshold) {
        return ResponseEntity.ok(statisticsService.getLongTermInventoryProducts(daysThreshold));
    }

    @GetMapping("/product/top-selling")
    @PreAuthorize( "hasAuthority('ROLE_SELLER')")
    public ResponseEntity<Map<String, Integer>> getTopSellingProducts(
            @RequestParam int limit,
            @RequestParam(defaultValue = "true") boolean isMostSold) {
        return ResponseEntity.ok(statisticsService.getTopSellingProducts(limit, isMostSold));
    }

}