package com.example.sep490.dto;


import io.swagger.v3.oas.annotations.media.Schema;
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
public class AddressRequest {
	private Long id;

    private Long userId;
    private Long shopId;

    private String recipientName;
    
    @Pattern(regexp = "^(0[3|5|7|8|9])\\d{8}$", message = "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (0912345678).")
    private String phone;
    
    @Size(min = 3, max = 255, message = "Địa chỉ phải có độ dài từ 3 đến 255 ký tự.")
    private String address;

    private String provinceId;
    private String districtId;
    private String wardId;
    private String province;
    private String district;
    private String ward;

    private String postalCode;

    @Schema(defaultValue = "false")
    private boolean defaultAddress;

    // Relationship
}
