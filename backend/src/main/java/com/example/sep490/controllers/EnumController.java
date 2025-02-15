package com.example.sep490.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/enums")
public class EnumController {
    @GetMapping("/")
    public ResponseEntity<?> getAddresses() {
        List<String> deliveryMedthod = Arrays.asList("GHN", "STRUCK");
        return ResponseEntity.ok(deliveryMedthod);
    }
}
