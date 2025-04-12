package com.example.sep490.controller.provider;

import com.example.sep490.dto.DeliveryDetailRequest;
import com.example.sep490.repository.specifications.DeliveryDetailFilterDTO;
import com.example.sep490.service.DeliveryDetailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider/deliverydetails")
public class DeliveryDetailController {
    @Autowired
    private DeliveryDetailService deliveryDetailService;

    @GetMapping("/")
    public ResponseEntity<?> getDeliveryDetails(@Valid DeliveryDetailFilterDTO filter) {
        return ResponseEntity.ok(deliveryDetailService.getDeliveryDetails(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeliveryDetailById(@PathVariable Long id) {
        return ResponseEntity.ok().body(deliveryDetailService.getDeliveryDetailById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDeliveryDetail(@Valid @RequestBody DeliveryDetailRequest deliveryDetail) {
        return ResponseEntity.ok().body(deliveryDetailService.createDeliveryDetail(deliveryDetail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDeliveryDetail(@PathVariable Long id,@Valid @RequestBody DeliveryDetailRequest deliveryDetail) {
        if (!id.equals(deliveryDetail.getId())) {
            return ResponseEntity.badRequest().body("id trong chi tiết phiếu giao hàng không trùng khớp.");
        }
        return ResponseEntity.ok().body(deliveryDetailService.updateDeliveryDetail(id, deliveryDetail));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeliveryDetail(@PathVariable Long id) {
        try {
            deliveryDetailService.deleteDeliveryDetail(id);
            return ResponseEntity.ok().body("Xóa chi tiết phiếu giao hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa chi tiết phiếu giao hàng.");
        }
    }
}