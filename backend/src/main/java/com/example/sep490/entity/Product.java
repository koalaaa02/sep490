package com.example.sep490.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.enums.UnitType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "tbl_product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends Auditable{//chi tiết cơ bản của sản phẩm
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Size(min = 0, max = 1000, message = "Địa chỉ phải có độ dài từ 0 đến 1000 ký tự.")
    private String description;
    @Size(min = 0, max = 1000, message = "Địa chỉ phải có độ dài từ 0 đến 1000 ký tự.")
    private String specifications;
    @Size(min = 0, max = 1000, message = "Ảnh phải có độ dài từ 0 đến 1000 ký tự.")
    private String images;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitType unit;

    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean active = false;

    // Relationship
//    @JsonManagedReference
    @JsonIgnoreProperties("products")
    @ManyToOne(fetch = FetchType.EAGER) // @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

//    @JsonBackReference
    @JsonIgnoreProperties("product")
    @OneToMany(mappedBy = "product")
    @SQLRestriction("is_delete = false AND active = true")
    private List<ProductSKU> skus;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier; // Mỗi sản phẩm sẽ liên kết với một nhà cung cấp
}

