package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sep490.entity.Auditable;
import com.example.sep490.entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSKUResponse{
	private Long id;

    private String skuCode;
    
    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1")
    @Max(value = 10000, message = "Số lượng tối đa là 10000")
    private int stock;
    
    @Min(value = 0, message = "costPrice không được là số âm.")
    private BigDecimal costPrice;
    
    @Min(value = 0, message = "listPrice không được là số âm.")
    private BigDecimal listPrice;
    
    @Min(value = 0, message = "sellingPrice không được là số âm.")
    private BigDecimal sellingPrice;
    
    @Min(value = 0, message = "wholesalePrice không được là số âm.")
    private BigDecimal wholesalePrice;
    
    private String images;
    private boolean bulky;
    @JsonIgnoreProperties({ "skus","category","shop","supplier"})
    private Product product;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
