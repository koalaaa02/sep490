package com.example.sep490.controller;

import com.example.sep490.dto.AuthRegisterRequest;
import com.example.sep490.dto.publicdto.ChangeForgotPasswordRequest;
import com.example.sep490.entity.User;
import com.example.sep490.repository.RedisDAO;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.AuthRequest;
import com.example.sep490.service.JwtService;
import com.example.sep490.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
    private UserService service;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private RedisDAO redisDAO;
    @Autowired
    private PasswordEncoder passwordEncoder;

	@PostMapping("/register")
    public ResponseEntity<?> addNewUser(@RequestBody AuthRegisterRequest userInfo) {
        User checkuser = service.getUserByUserNameOrEmail(userInfo.getEmail(), userInfo.getName());
        if(checkuser != null) return  ResponseEntity.badRequest().body("Email hoặc UserName đã tồn tại");
        return ResponseEntity.ok().body(service.addUser(userInfo));
    }

    @PostMapping("/activate")
    public String activateAccount(@RequestBody ActivateAccount activateAccount) {
        return service.activateAccount(
                activateAccount.email,
                activateAccount.resetToken
        );
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        User checkUser = service.getUserByEmailIgnoreCase(authRequest.getEmail());
        if(checkUser == null) return  ResponseEntity.badRequest().body("Email không tồn tại.");
        if(!checkUser.isActive()) return  ResponseEntity.badRequest().body("Tài khoản chưa được kích hoạt.");
        if (!passwordEncoder.matches(authRequest.getPassword(), checkUser.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác");
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(checkUser.getName(), authRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtService.generateToken(checkUser.getName()));
            response.put("uid", checkUser.getId());
            response.put("roles", user.getRoles());
            response.put("lastName", checkUser.getLastName());
            response.put("firstName", checkUser.getFirstName());
            return ResponseEntity.ok(response);
        } else {
            throw new UsernameNotFoundException("invalid user request !");
        }
    }

    @GetMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtService.generateToken(user.getUsername()));
            response.put("roles", user.getRoles());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body("invalid user request !");
    }

    public static class EmailDTO {
        public String email;
    }

    public static class ActivateAccount {
        public String email;
        public String resetToken;
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody EmailDTO email) {
        return service.forgotPassword(email.email);
    }

    @PostMapping("/forgot-password/change")
    public String changeForgotPassword(@RequestBody ChangeForgotPasswordRequest request) {
        return service.changeForgotPassword(
                request.getEmail(),
                request.getResetToken(),
                request.getNewPassword(),
                request.getConfirmNewPassword()
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam("token") String token) {
        long expirationTime = 3600;
        redisDAO.save(token, expirationTime);
        return ResponseEntity.ok("Đăng xuất thành công!");
    }



    //    @GetMapping("/me")
//    public String getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
//            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//            return "Username: " + userDetails.getUsername() + ", Roles: " + userDetails.getAuthorities();
//        }
//        return "No authenticated user";
//    }
//
//    @GetMapping("/me1")
//    public String getCurrentUser1() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
//            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
//            return "User ID: " + user.getPassword() + ", Email: " + user.getUsername();
//        }
//        return "No authenticated user";
//    }
}
