package com.example.sep490.dto.GHN;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.UpperCamelCaseStrategy.class)
public class ProvinceDTO {
//    @JsonProperty("ProvinceID")
    private Integer ProvinceID;
    private String ProvinceName;
    private Integer CountryID;
    private String ProvinceEncode;
    private Integer RegionID;
    private Integer AreaID;
    private Boolean CanUpdateCOD;
    private Integer Status;
    private String CreatedIP;
    private Long CreatedEmployee;
    private String CreatedSource;
    private ZonedDateTime CreatedDate;
    private String UpdatedIP;
    private Long UpdatedEmployee;
    private String UpdatedSource;
    private ZonedDateTime UpdatedDate;

    // Optional fields
    private String Code;
    private List<String> NameExtension;
    private Integer IsEnable;
    private Integer RegionCPN;
    private Long UpdatedBy;
}
