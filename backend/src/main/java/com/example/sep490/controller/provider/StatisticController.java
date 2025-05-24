package com.example.sep490.controller.provider;

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
@RequestMapping("/api/provider/statistics")
public class StatisticController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/order")
    public Map<String, Object> getOrderStatistics(@RequestParam Long sellerId) {
        return statisticsService.getOrderStatistics(sellerId);
    }

    @GetMapping("/order/period")
    public ResponseEntity<Map<String, Integer>> getOrderStatisticsPeriod(
            @RequestParam Long sellerId,
            @RequestParam(value = "month",required = false) Integer month,
            @RequestParam(value = "year",required = false) Integer year ) {
        return ResponseEntity.ok().body(statisticsService.getOrderStatisticsByPeriod(sellerId,month, year));
    }


    @GetMapping("/product/inventory")
    public ResponseEntity<Map<String, Integer>> getInventoryStatistics() {
        return ResponseEntity.ok(statisticsService.getProductInventoryStatistics());
    }

    @GetMapping("/product/sales")
    public ResponseEntity<Map<String, Integer>> getSalesStatistics(
            @RequestParam String from,
            @RequestParam String to) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime fromDate = LocalDateTime.parse(from, formatter);
        LocalDateTime toDate = LocalDateTime.parse(to, formatter);

        return ResponseEntity.ok(statisticsService.getProductSalesStatistics(fromDate, toDate));
    }

    @GetMapping("/product/long-term")
    public ResponseEntity<List<ProductSKUResponse>> getLongTermInventoryProducts(
            @RequestParam int daysThreshold) {
        return ResponseEntity.ok(statisticsService.getLongTermInventoryProducts(daysThreshold));
    }

    @GetMapping("/product/top-selling")
    public ResponseEntity<Map<String, Integer>> getTopSellingProducts(
            @RequestParam int limit,
            @RequestParam(defaultValue = "true") boolean isMostSold) {
        return ResponseEntity.ok(statisticsService.getTopSellingProducts(limit, isMostSold));
    }

    @GetMapping("/product/NearlyOutOfStock")
    public ResponseEntity<?> getNearlyOutOfStockInventoryProducts(@RequestParam int limit) {
        return ResponseEntity.ok(statisticsService.getNearlyOutOfStockInventoryProducts(limit));
    }

    @GetMapping("/product/OutOfStock")
    public ResponseEntity<?> getOutOfStockInventoryProducts() {
        return ResponseEntity.ok(statisticsService.getOutOfStockInventoryProducts());
    }

}