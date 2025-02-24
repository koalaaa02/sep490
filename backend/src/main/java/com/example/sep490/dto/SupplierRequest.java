package com.example.sep490.dto;

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
public class SupplierRequest {
	private Long id;

    private String name;

    @Email(message = "Email không hợp lệ")
    private String contactEmail;
    
    @Pattern(regexp = "^(0[3|5|7|8|9])\\d{8}$", message = "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.")
    private String phone;

    private String address;

    // Relationship
}
