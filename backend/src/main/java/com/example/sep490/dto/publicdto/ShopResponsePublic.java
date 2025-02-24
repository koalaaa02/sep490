package com.example.sep490.dto.publicdto;

import com.example.sep490.entity.Address;
import com.example.sep490.entity.Product;
import com.example.sep490.entity.enums.ShopType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopResponsePublic{
	private Long id;
    private String name;
    private String secretA;
    private String secretB;
    private String registrationCertificate;
    private String TIN;
    private String citizenIdentificationCard;
    private ShopType shopType;
    private boolean active = true;

    @JsonIgnoreProperties({"shop", "user"})
    private Address address;
    @JsonIgnoreProperties({"shop", "category","supplier","skus"})
    private List<Product> products;
}
