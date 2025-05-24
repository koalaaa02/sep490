package com.example.sep490.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSKURequest {
	private Long id;

    private String skuCode;
    
    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1")
    @Max(value = 10000, message = "Số lượng tối đa là 10000")
    private int stock;
    
    @Min(value = 0, message = "costPrice không được là số âm.")
    private BigDecimal costPrice;
    
    @Min(value = 0, message = "listPrice không được là số âm.")
    private BigDecimal listPrice;

    @NotNull(message = "Giá bán không được để trống.")
    @Min(value = 1000, message = "sellingPrice phải lớn hơn hoặc bằng 1000.")
    private BigDecimal sellingPrice;
    
    @Min(value = 0, message = "wholesalePrice không được là số âm.")
    private BigDecimal wholesalePrice;
    
    private String images;

    @Schema(defaultValue = "false")
    private boolean bulky = false;

    // Relationship
    private Long productId;
}
