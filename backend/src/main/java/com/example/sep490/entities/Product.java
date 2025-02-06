package com.example.sep490.entities;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
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

//    @JsonManagedReference
    @JsonIgnoreProperties("products")
    @ManyToOne(fetch = FetchType.EAGER) // @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

//    @JsonBackReference
    @JsonIgnoreProperties("product")
    @OneToMany(mappedBy = "product")
    private List<ProductSku> skus;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier; // Mỗi sản phẩm sẽ liên kết với một nhà cung cấp
}

