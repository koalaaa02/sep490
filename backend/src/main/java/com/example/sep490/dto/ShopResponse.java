package com.example.sep490.dto;

import java.util.List;

import com.example.sep490.entities.Address;
import com.example.sep490.entities.Order;
import com.example.sep490.entities.User;

import com.example.sep490.entities.enums.ShopType;
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
    private String secretA;
    private String secretB;
    private String registrationCertificate;
    private String TIN;
    private String citizenIdentificationCard;
    private ShopType shopType;
    private List<Order> orders;
    private boolean isActive = true;
    private User manager;
    private Address address;

}
