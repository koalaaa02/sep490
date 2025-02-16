package com.example.sep490.entities;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSKU  extends Auditable{//SKU (Stock Keeping Unit) or phân loại sản phẩm
	//là một mã số duy nhất được sử dụng để xác định và theo dõi hàng hóa trong kho.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String skuCode;
    
    @Column(nullable = false)
    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1")
    @Max(value = 10000, message = "Số lượng tối đa là 10000")
    private int stock;
    
    @Min(value = 0, message = "costPrice không được là số âm.")
    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0.0")
    private BigDecimal costPrice;
    
    @Min(value = 0, message = "listPrice không được là số âm.")
    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0.0")
    private BigDecimal listPrice;
    
    @Min(value = 0, message = "sellingPrice không được là số âm.")
    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0.0")
    private BigDecimal sellingPrice;
    
    @Min(value = 0, message = "wholesalePrice không được là số âm.")
    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0.0")
    private BigDecimal wholesalePrice;
    
    private String images;
    
    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean isBulky = false;  //đánh dấu hàng cồng kềnh

    // Relationship
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

//    @OneToMany(mappedBy = "sku")
//    private List<AttributeValue> attributeValues;//các giá trị thuôc tính mà sản phẩm mang: red, M, cotton
}
