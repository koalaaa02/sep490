package com.example.sep490.controller;

import com.example.sep490.dto.FinancialReportResponse;
import com.example.sep490.service.FinancialReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/financialReport")
public class FinancialReportController {
    @Autowired
    private FinancialReportService financialReportService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_PROVIDER')")
    public ResponseEntity<?> getFinancialReport(@RequestParam("month") int month, @RequestParam("year") int year) {
        FinancialReportResponse report = financialReportService.generateReport(month, year);
        return ResponseEntity.ok().body(report);
    }
}
