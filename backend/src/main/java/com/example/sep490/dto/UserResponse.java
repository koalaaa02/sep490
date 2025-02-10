package com.example.sep490.dto;

import java.util.List;

import com.example.sep490.entities.Address;
import com.example.sep490.entities.Invoice;
import com.example.sep490.entities.Order;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.enums.UserType;
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
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
        
    private boolean isActive = true;
    
    private String roles = "ROLE_CUSTOMER";

    private UserType userType = UserType.ROLE_CUSTOMER; // CUSTOMER, SELLER, AGENT

//    private List<Order> orders;

    @JsonIgnoreProperties({"debtPayments","agent"})
    private List<Invoice> invoices;

    @JsonIgnoreProperties({"user","shop"})
    private List<Address> addresses;

    @JsonIgnoreProperties({"manager","address","products","orders"})
    private Shop shop; 
}
