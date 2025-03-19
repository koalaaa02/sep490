package com.example.sep490.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.*;
import com.example.sep490.entity.enums.UserType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
	private Long id;
    private String name;
    private String firstName;
    private String lastName;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    private boolean active = true;
    private List<Role> roles;
    private UserType userType = UserType.ROLE_DEALER; // DEALER, PROVIDER, AGENT

//    private List<Order> orders;
    @JsonIgnoreProperties({"debtPayments","agent","order"})
    private List<Invoice> invoices;

    @JsonIgnoreProperties({"user","shop"})
    private List<Address> addresses;

    @JsonIgnoreProperties({"manager","address","products","orders"})
    private Shop shop;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
