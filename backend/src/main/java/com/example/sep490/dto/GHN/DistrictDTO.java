package com.example.sep490.dto.GHN;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.UpperCamelCaseStrategy.class)
public class DistrictDTO {
    private Integer DistrictID;
    private Integer ProvinceID;
    private String DistrictName;
    private String Code;
    private Integer Type;
    private Integer SupportType;
    private List<String> NameExtension;
    private Integer IsEnable;
    private String CreatedAt;
    private String UpdatedAt;
    private Boolean CanUpdateCOD;
    private Integer Status;
    private Integer PickType;
    private Integer DeliverType;
    private Integer UpdatedBy;
    private Integer UpdatedEmployee;
    private String UpdatedSource;
    private String UpdatedDate;
}

