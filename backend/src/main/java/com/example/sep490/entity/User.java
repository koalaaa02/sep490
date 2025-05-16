package com.example.sep490.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Builder;
import org.hibernate.annotations.ColumnDefault;

import com.example.sep490.entity.enums.UserType;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends Auditable{ //thông tin tài khoản
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @JsonIgnore
    private String password;
    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean active = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tbl_user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'ROLE_DEALER'")
    private UserType userType; // ROLE_DEALER, ROLE_PROVIDER, ROLE_AGENT, ROLE_ADMIN

    private String resetToken;// Token đặt lại mật khẩu hoặc mã OTP
    private LocalDateTime resetTokenExpiry;// Thời gian hết hạn OTP

    private String TIN;//mã số thuế
    private String citizenIdentificationCard;//CCCD
    private String citizenIdentificationCardImageUp;//CCCDImageUp
    private String citizenIdentificationCardImageDown;//CCCDImageDown
    private String shopName;

    // Relationship
    @OneToMany(mappedBy = "agent")
    private List<Invoice> invoices; // mỗi agent có thể nợ nhiều hóa đơn

    @OneToMany(mappedBy = "user")
    private List<Address> addresses;

    @OneToOne(mappedBy = "manager") // Mỗi seller có thể quản lý một shop
    private Shop shop; // Một shop chỉ có một người quản lý
}

