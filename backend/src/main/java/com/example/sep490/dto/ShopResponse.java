package com.example.sep490.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.*;

import com.example.sep490.entity.enums.ShopType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Pattern;
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

    private String registrationCertificateImages;
    private String TIN;
    private String citizenIdentificationCard;
    private String citizenIdentificationCardImageUp;//CCCDImageUp
    private String citizenIdentificationCardImageDown;//CCCDImageDown
    private ShopType shopType;
    private String logoImage;
    private String hotline;
    private boolean active = true;
    private boolean close = false;

    private BigDecimal totalFeeDueAmount = BigDecimal.ZERO;
    private LocalDateTime lastPaymentDate;

    @JsonIgnore
    private List<Order> orders;
    @JsonIgnoreProperties({"shop","addresses","invoices"})
    private User manager;
    @JsonIgnoreProperties({"shop", "user"})
    private Address address;
//    @JsonIgnoreProperties({"shop", "category","supplier","skus"})
//    private List<Product> products;
    private BankAccount bankAccount;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
