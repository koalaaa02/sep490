package com.example.sep490.dto;

import com.example.sep490.entities.enums.ShopType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopRequest {
	private Long id;

    private String name;

    @NotNull
    private Long managerId;
    private Long addressId;
    private String registrationCertificate;
    private String TIN;
    private String citizenIdentificationCard;
    @NotNull(message = "Status được để trống.")
    private ShopType shopType;
    private boolean isActive = true;

    private String secretA;
    private String secretB;
}
//*
