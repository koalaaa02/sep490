package com.example.sep490.controller;

import com.example.sep490.repository.specifications.AddressFilterDTO;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.AddressRequest;
import com.example.sep490.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER', 'ROLE_DEALER')")
public class AddressController {
    private static final Logger logger = LoggerFactory.getLogger(AddressController.class);

    @Autowired
    private AddressService addressService;

    @GetMapping("/")
    public ResponseEntity<?> getAddresses(@Valid AddressFilterDTO filter) {
        logger.info("Fetching addresses with pagination, sort, and filter options.");
        return ResponseEntity.ok(addressService.getAddresses(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAddressById(@PathVariable Long id) {
        logger.info("Fetching address with id: {}", id);
        return ResponseEntity.ok().body(addressService.getAddressById(id));
    }

    @PostMapping
    public ResponseEntity<?> createAddress(@Valid @RequestBody AddressRequest address) {
        logger.info("Creating new address.");
        return ResponseEntity.ok().body(addressService.createAddress(address));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id,@Valid @RequestBody AddressRequest address) {
        logger.info("Updating address with id: {}", id);
        if (!id.equals(address.getId())) {
            return ResponseEntity.badRequest().body("id và id trong địa chỉ không trùng khớp.");
        }
        return ResponseEntity.ok().body(addressService.updateAddress(id, address));
    }

    @PutMapping("/setdefault/{id}")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Long id) {
        logger.info("Updating address with id: {}", id);
        addressService.setDefaultAddress(id);
        return ResponseEntity.ok().body("Thay đổi địa chỉ mặc định thành công.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        logger.info("Deleting address with id: {}", id);
        try {
            addressService.deleteAddress(id);
            return ResponseEntity.ok().body("Xóa địa chỉ thành công.");
        } catch (Exception e) {
            logger.error("Error deleting address with id: {}", id, e);
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa địa chỉ.");
        }
    }
}