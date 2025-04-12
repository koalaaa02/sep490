package com.example.sep490.dto;

import com.example.sep490.entity.enums.ShopType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopRequest {
	private Long id;

    private String name;

//    @NotNull
//    private Long managerId;

    private String registrationCertificateImages;
    private String TIN;
    private String citizenIdentificationCard;
    @NotNull(message = "Status được để trống.")
    private ShopType shopType;
    @Schema(defaultValue = "false")
    private boolean active = false;
    @Schema(defaultValue = "false")
    private boolean close = false;

    private BigDecimal totalFeeDueAmount = BigDecimal.ZERO;
    private LocalDateTime lastPaymentDate;

    private String secretA;
    private String secretB;

    // Relationship
    private Long addressId;
    private Long bankAccountId;
}
//*
