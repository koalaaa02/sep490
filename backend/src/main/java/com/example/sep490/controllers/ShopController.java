package com.example.sep490.controllers;

import com.example.sep490.repositories.specifications.ShopFilterDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.ShopRequest;
import com.example.sep490.services.ShopService;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    private static final Logger logger = LoggerFactory.getLogger(ShopController.class);

    @Autowired
    private ShopService shopService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> getShops(ShopFilterDTO filter) {
        return ResponseEntity.ok(shopService.getShops(filter));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> getShopById(@PathVariable Long id) {
        return ResponseEntity.ok().body(shopService.getShopById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> createShop(@RequestBody ShopRequest shopRequest) {
        return ResponseEntity.ok().body(shopService.createShop(shopRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> updateShop(@PathVariable Long id, @RequestBody ShopRequest shopRequest) {
        if (!id.equals(shopRequest.getId())) {
            return ResponseEntity.badRequest().body("id và id trong cửa hàng không trùng khớp.");
        }
        return ResponseEntity.ok().body(shopService.updateShop(id, shopRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER')")
    public ResponseEntity<?> deleteShop(@PathVariable Long id) {
        try {
            shopService.deleteShop(id);
            return ResponseEntity.ok().body("Xóa cửa hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa cửa hàng.");
        }
    }
}