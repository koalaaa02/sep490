package com.example.sep490.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_address")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address  extends Auditable{//một user có nhiều địa chỉ giao hàng, 1 Order chỉ mang 1 địa chỉ giao hàng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientName;
    @Pattern(regexp = "^(0[3|5|7|8|9])\\d{8}$", message = "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (0912345678).")
    private String phone;
    private String provinceId;
    private String districtId;
    private String wardId;
    private String province;
    private String district;
    private String ward;
    private String postalCode;
    @Size(min = 3, max = 255, message = "Địa chỉ phải có độ dài từ 3 đến 255 ký tự.")
    private String address;
    private boolean defaultAddress; // Đánh dấu địa chỉ mặc định


    //relationship
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;
}
