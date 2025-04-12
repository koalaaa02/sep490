package com.example.sep490.controller.provider;

import com.example.sep490.dto.DeliveryNoteRequest;
import com.example.sep490.repository.specifications.DeliveryNoteFilterDTO;
import com.example.sep490.service.DeliveryNoteService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider/deliverynotes")
public class DeliveryNoteController {

    @Autowired
    private DeliveryNoteService deliveryNoteService;

    @GetMapping("/")
    public ResponseEntity<?> getDeliveryNotes(@Valid DeliveryNoteFilterDTO filter) {
        return ResponseEntity.ok(deliveryNoteService.getDeliveryNotes(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeliveryNoteById(@PathVariable Long id) {
        return ResponseEntity.ok().body(deliveryNoteService.getDeliveryNoteById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDeliveryNote(@Valid @RequestBody DeliveryNoteRequest deliveryNote) {
        return ResponseEntity.ok().body(deliveryNoteService.createDeliveryNote(deliveryNote));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDeliveryNote(@PathVariable Long id,@Valid @RequestBody DeliveryNoteRequest deliveryNote) {
        if (!id.equals(deliveryNote.getId())) {
            return ResponseEntity.badRequest().body("id và id trong phiếu giao hàng không trùng khớp.");
        }
        return ResponseEntity.ok().body(deliveryNoteService.updateDeliveryNote(id, deliveryNote));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeliveryNote(@PathVariable Long id) {
        try {
            deliveryNoteService.deleteDeliveryNote(id);
            return ResponseEntity.ok().body("Xóa phiếu giao hàng thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa phiếu giao hàng.");
        }
    }
}