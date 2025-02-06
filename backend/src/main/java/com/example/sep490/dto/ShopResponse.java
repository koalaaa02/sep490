package com.example.sep490.dto;

import java.util.List;

import com.example.sep490.entities.Order;
import com.example.sep490.entities.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopResponse {
	private Long id;

    private String name; 

    private List<Order> orders;

    private User manager; 
}
