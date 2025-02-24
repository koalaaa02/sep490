package com.example.sep490.controller;

import com.example.sep490.dto.ProductSKUResponse;
import com.example.sep490.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/order")
    @PreAuthorize( "hasAuthority('ROLE_PROVIDER')")
    public Map<String, Object> getOrderStatistics(@RequestParam Long sellerId) {
        return statisticsService.getOrderStatistics(sellerId);
    }

    @GetMapping("/order/period")
    @PreAuthorize( "hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<Map<String, Integer>> getOrderStatisticsPeriod(@RequestParam Long sellerId, @RequestParam(value = "month",required = false, defaultValue = "0") int month,@RequestParam(value = "year",required = false) int year ) {
        return ResponseEntity.ok().body(statisticsService.getOrderStatisticsByPeriod(sellerId,month, year));
    }


    @GetMapping("/product/inventory")
    @PreAuthorize( "hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<Map<String, Integer>> getInventoryStatistics() {
        return ResponseEntity.ok(statisticsService.getProductInventoryStatistics());
    }

    @GetMapping("/product/sales")
    @PreAuthorize( "hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<Map<String, Integer>> getSalesStatistics(
            @RequestParam String from,
            @RequestParam String to) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime fromDate = LocalDateTime.parse(from, formatter);
        LocalDateTime toDate = LocalDateTime.parse(to, formatter);

        return ResponseEntity.ok(statisticsService.getProductSalesStatistics(fromDate, toDate));
    }

    @GetMapping("/product/long-term")
    @PreAuthorize( "hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<List<ProductSKUResponse>> getLongTermInventoryProducts(
            @RequestParam int daysThreshold) {
        return ResponseEntity.ok(statisticsService.getLongTermInventoryProducts(daysThreshold));
    }

    @GetMapping("/product/top-selling")
    @PreAuthorize( "hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<Map<String, Integer>> getTopSellingProducts(
            @RequestParam int limit,
            @RequestParam(defaultValue = "true") boolean isMostSold) {
        return ResponseEntity.ok(statisticsService.getTopSellingProducts(limit, isMostSold));
    }

    @GetMapping("/product/NearlyOutOfStock")
    @PreAuthorize( "hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<?> getNearlyOutOfStockInventoryProducts(@RequestParam int limit) {
        return ResponseEntity.ok(statisticsService.getNearlyOutOfStockInventoryProducts(limit));
    }

    @GetMapping("/product/OutOfStock")
    @PreAuthorize( "hasAuthority('ROLE_PROVIDER')")
    public ResponseEntity<?> getOutOfStockInventoryProducts() {
        return ResponseEntity.ok(statisticsService.getOutOfStockInventoryProducts());
    }

}