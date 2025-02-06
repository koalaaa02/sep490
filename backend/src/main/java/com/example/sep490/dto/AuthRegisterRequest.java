package com.example.sep490.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRegisterRequest {    
    private String name;
    @Email(message = "Email không hợp lệ")
    private String email;
    private String password;
}
