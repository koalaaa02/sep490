package com.example.sep490.dto;

import com.example.sep490.entity.enums.ShopType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
    private String registrationCertificateImages;
    private String TIN;
    private String citizenIdentificationCard;
    private String citizenIdentificationCardImageUp;//CCCDImageUp
    private String citizenIdentificationCardImageDown;//CCCDImageDown
    private String logoImage;
    @Pattern(regexp = "^(0[3|5|7|8|9])\\d{8}$", message = "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (0912345678).")
    private String hotline;
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
