package com.example.sep490.entity;


import com.example.sep490.entity.enums.ShopType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop  extends Auditable{//Shop mà admin tạo cho user(sau đó được cập nhật role seller)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name; // Tên shop
    private String registrationCertificateImages;//link ảnh giấy đăng ký kinh doanh

    private String secretA; 
    private String secretB;

    private String TIN;//mã số thuế
    private String citizenIdentificationCard;//CCCD

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShopType shopType;// doanh nghiệp, cá nhân

    private boolean isActive = true; // shop đang active hay không
    private boolean isClose = false; // shop đang mở bán hay không

    private BigDecimal totalFeeDueAmount = BigDecimal.ZERO; // Tổng tiền còn nợ
    private LocalDateTime lastPaymentDate; // Ngày thanh toán phí gần nhất

    // Relationship
    @OneToMany(mappedBy = "shop")
    private List<Order> orders; // Một shop có thể có nhiều đơn hàng

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User manager; // Một shop có một người quản lý

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @JsonIgnoreProperties("shop")
    @OneToMany(mappedBy = "shop")
    private List<Product> products;
}
