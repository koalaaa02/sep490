package com.example.sep490.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopCart {
    private Long shopId;
    private String shopName;
    private List<ItemCart> items;
}
