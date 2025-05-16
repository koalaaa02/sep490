package com.example.sep490.dto.GHN;

import lombok.Data;

import java.util.List;

@Data
public class GHNDistrictResponse {
    private int code;
    private String message;
    private List<DistrictDTO> data;
}
