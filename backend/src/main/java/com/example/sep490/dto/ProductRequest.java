package com.example.sep490.dto;

import com.example.sep490.entity.Supplier;
import com.example.sep490.entity.enums.UnitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    private Long id; 
    private String name;
    private String description;
    private String specifications;
    private UnitType unit = UnitType.PCS;
    private String unitAdvance;
    private String images;
    private boolean active = false;
    private boolean stop = false;

    // Relationship
    private Long categoryId;
    private Long supplierId;
    private Long shopId;
}

