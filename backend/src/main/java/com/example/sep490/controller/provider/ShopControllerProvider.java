package com.example.sep490.controller.provider;

import com.example.sep490.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/provider/shops")
public class ShopControllerProvider {
    @Autowired
    private ShopService shopService;

    @GetMapping("/myshop")
    public ResponseEntity<?> getMyShop() {
        return ResponseEntity.ok().body(shopService.getShopByContextUser());
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<String> updateCloseShop(@PathVariable Long id) {
        shopService.changeCloseShop(id);
        return ResponseEntity.ok("Cập nhật trạng thái cửa hàng thành công!");
    }

    @PostMapping(value = "/{id}/uploadRegistrationCertificate", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadRegistrationCertificateImages(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok().body(shopService.uploadRegistrationCertificate(id, file)) ;
    }
}
