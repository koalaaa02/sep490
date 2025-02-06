package com.example.sep490.dto;

import com.example.sep490.entities.User;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingAddressResponse {
	private Long id;

    private User user;

    private String recipientName;
    
    @Pattern(regexp = "^(0[3|5|7|8|9])\\d{8}$", message = "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (0912345678).")
    private String phone;
    
    @Size(min = 3, max = 255, message = "Địa chỉ phải có độ dài từ 3 đến 255 ký tự.")
    private String address;
    
    private String province;
    private String district;
    private String ward;
    private String postalCode;

    private boolean isDefault; 
}
