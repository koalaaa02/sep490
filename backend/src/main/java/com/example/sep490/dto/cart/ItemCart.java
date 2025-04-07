package com.example.sep490.dto.cart;

import com.example.sep490.dto.ProductSKUResponse;
import com.example.sep490.entity.ProductSKU;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCart {
    private Long productId;
    private Long productSKUId;
    private String productName;
    private String productSKUCode;
    private String imageUrl;
    private BigDecimal price;
    private int quantity;
    //flexible
    private ProductSKUResponse productSKUResponse;
}
