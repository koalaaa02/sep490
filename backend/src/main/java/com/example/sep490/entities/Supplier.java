package com.example.sep490.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier  extends Auditable{//nhà cung câps sản phẩm

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Email(message = "Email không hợp lệ")
    private String contactEmail;
    
    @Pattern(regexp = "^(0[3|5|7|8|9])\\d{8}$", message = "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.")
    private String phone;

    private String address;

    @JsonIgnoreProperties("supplier")
    @OneToMany(mappedBy = "supplier")
    private List<Product> products; // Mỗi nhà cung cấp có thể cung cấp nhiều sản phẩm
}
