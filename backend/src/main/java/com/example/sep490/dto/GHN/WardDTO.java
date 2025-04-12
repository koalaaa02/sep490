package com.example.sep490.dto.GHN;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.UpperCamelCaseStrategy.class)
public class WardDTO {
    private String WardCode;
    private Integer DistrictID;
    private String WardName;
    private List<String> NameExtension;
    private Boolean CanUpdateCOD;
    private Integer SupportType;
    private Integer PickType;
    private Integer DeliverType;
    private Integer Status;
    private String ReasonCode;
    private String ReasonMessage;
    private Integer CreatedEmployee;
    private String CreatedSource;
    private String CreatedDate;
    private Integer UpdatedEmployee;
    private String UpdatedSource;
    private String UpdatedDate;
}

