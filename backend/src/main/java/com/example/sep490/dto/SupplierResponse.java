package com.example.sep490.dto;

import java.util.List;

import com.example.sep490.entities.Product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierResponse {
	private Long id;

    private String name;

    @Email(message = "Email không hợp lệ")
    private String contactEmail;
    
    @Pattern(regexp = "^(0[3|5|7|8|9])\\d{8}$", message = "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.")
    private String phone;

    private String address;

    @JsonIgnoreProperties({"shop", "category","supplier","skus"})
    private List<Product> products; 
}
