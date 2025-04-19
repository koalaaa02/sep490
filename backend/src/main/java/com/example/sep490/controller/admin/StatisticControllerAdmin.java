package com.example.sep490.controller.admin;

import com.example.sep490.service.StatisticServiceAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/statistics")
public class StatisticControllerAdmin {
    @Autowired
    private StatisticServiceAdmin statisticService;

    @GetMapping("/shops")
    public ResponseEntity<Map<String, Long>> getNumberOfShops() {
        return ResponseEntity.ok(statisticService.numberOfShop());
    }

    @GetMapping("/shops/new")
    public ResponseEntity<Long> getNewShopsThisMonth() {
        return ResponseEntity.ok(statisticService.newShopsThisMonth());
    }

    @GetMapping("/users")
    public ResponseEntity<Long> getTotalUsers() {
        return ResponseEntity.ok(statisticService.totalUsers());
    }

    @GetMapping("/users/roles")
    public ResponseEntity<Map<String, Long>> getUsersByRole() {
        return ResponseEntity.ok(statisticService.usersByRole());
    }

    @GetMapping("/users/new")
    public ResponseEntity<Long> getNewUsers(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(statisticService.newUsers(month, year));
    }


    @GetMapping("/revenue")
    public ResponseEntity<BigDecimal> getRevenue(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(statisticService.revenueInMonth(month, year));
    }

}
