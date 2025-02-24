package com.example.sep490.controller;

import com.example.sep490.repository.specifications.ShopFilterDTO;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.ShopRequest;
import com.example.sep490.service.ShopService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    private static final Logger logger = LoggerFactory.getLogger(ShopController.class);

    @Autowired
    private ShopService shopService;

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> getShops(@Valid ShopFilterDTO filter) {
        return ResponseEntity.ok(shopService.getShops(filter));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> getShopById(@PathVariable Long id) {
        return ResponseEntity.ok().body(shopService.getShopById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> createShop(@Valid @RequestBody ShopRequest shopRequest) {
        return ResponseEntity.ok().body(shopService.createShop(shopRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> updateShop(@PathVariable Long id,@Valid @RequestBody ShopRequest shopRequest) {
        if (!id.equals(shopRequest.getId())) {
            return ResponseEntity.badRequest().body("id và id trong cửa hàng không trùng khớp.");
        }
        return ResponseEntity.ok().body(shopService.updateShop(id, shopRequest));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<String> updateCloseShop(@PathVariable Long id) {
        shopService.changeCloseShop(id);
        return ResponseEntity.ok("Cập nhật trạng thái cửa hàng thành công!");
    }

    @PutMapping("/{id}/active")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<String> updateActiveShop(@PathVariable Long id) {
        shopService.changeActiveShop(id);
        return ResponseEntity.ok("Cập nhật trạng thái cửa hàng thành công!");
    }

    @PostMapping(value = "/{id}/uploadRegistrationCertificate", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadRegistrationCertificateImages(@PathVariable Long id,@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok().body(shopService.uploadRegistrationCertificate(id, file)) ;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER')")
    public ResponseEntity<?> deleteShop(@PathVariable Long id) {
        try {
            shopService.deleteShop(id);
            return ResponseEntity.ok().body("Xóa cửa hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa cửa hàng.");
        }
    }
}