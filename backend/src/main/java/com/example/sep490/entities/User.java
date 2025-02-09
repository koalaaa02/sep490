package com.example.sep490.entities;

import java.util.List;

import jakarta.persistence.*;
import lombok.Builder;
import org.hibernate.annotations.ColumnDefault;

import com.example.sep490.entities.enums.UserType;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends Auditable{ //thông tin tài khoản
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    private String password;
    
    @Column(nullable = false)
    @ColumnDefault("true")
    private boolean isActive = true;
    
    @ColumnDefault("'ROLE_CUSTOMER'")
    private String roles;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'ROLE_CUSTOMER'")
    private UserType userType; // CUSTOMER, SELLER, AGENT

//    @OneToMany(mappedBy = "user")
//    private List<Order> orders; // order customer mua
    
    @OneToMany(mappedBy = "agent")
    private List<Invoice> invoices; // mỗi agent có thể nợ nhiều hóa đơn

    @OneToMany(mappedBy = "user")
    private List<Address> addresses;

    @OneToOne(mappedBy = "manager") // Mỗi seller có thể quản lý một shop
    private Shop shop; // Một shop chỉ có một người quản lý
}

