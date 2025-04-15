package com.example.sep490.controller;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.ShopRequest;
import com.example.sep490.dto.UserRequest;
import com.example.sep490.dto.publicdto.ChangePasswordRequest;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.mapper.UserMapper;
import com.example.sep490.repository.specifications.InvoiceFilterDTO;
import com.example.sep490.repository.specifications.OrderFilterDTO;
import com.example.sep490.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/myprofile")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER', 'ROLE_DEALER')")
public class MyProfileController {
    @Autowired
    private UserService userService;


    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(userService.getUserById(user.getId()));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @PutMapping("/updateMyProfile")
    public ResponseEntity<?> updateMyProfile(@RequestBody UserRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            if(!user.getId().equals(request.getId()))
                throw new RuntimeException("Bạn không có quyền thay đổi profile này.");
            return ResponseEntity.ok().body(userService.updateUser(user.getId(), request));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request) {
        // Lấy email người dùng từ authentication context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return userService.changePassword(user.getUsername(), request.getOldPassword(), request.getNewPassword(), request.getConfirmNewPassword());
        }
        throw new RuntimeException("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
    }

    @PostMapping(value = "/uploadCitizenIdentityCardUp", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadCitizenIdentificationCardUp(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(userService.uploadCCCD(id, file, true)) ;
        }
        throw new RuntimeException("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
    }

    @PostMapping(value = "/uploadCitizenIdentityCardDown", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadCitizenIdentificationCardDown(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(userService.uploadCCCD(id, file, false)) ;
        }
        throw new RuntimeException("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
    }
}
