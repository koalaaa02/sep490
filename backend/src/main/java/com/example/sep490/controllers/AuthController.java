package com.example.sep490.controllers;

import com.example.sep490.dto.AuthRegisterRequest;
import com.example.sep490.dto.publicdto.ChangeForgotPasswordRequest;
import com.example.sep490.dto.publicdto.ChangePasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.AuthRequest;
import com.example.sep490.entities.User;
import com.example.sep490.services.JwtService;
import com.example.sep490.services.UserService;

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
    
	@PostMapping("/register")
    public String addNewUser(@RequestBody AuthRegisterRequest userInfo) {
        return service.addUser(userInfo);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtService.generateToken(authRequest.getUsername()));
            response.put("roles", user.getRoles());
            return ResponseEntity.ok(response);
        } else {
            throw new UsernameNotFoundException("invalid user request !");
        }
    }
    
    @GetMapping("/me")
    public String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return "Username: " + userDetails.getUsername() + ", Roles: " + userDetails.getAuthorities();
        }
        return "No authenticated user";
    }
    
    @GetMapping("/me1")
    public String getCurrentUser1() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return "User ID: " + user.getPassword() + ", Email: " + user.getUsername();
        }
        return "No authenticated user";
    }

    public static class EmailDTO {
        public String email;
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
}
