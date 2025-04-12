package com.example.sep490.dto.GHN;

import lombok.Data;
import java.util.List;

@Data
public class GHNProvinceResponse {
    private int code;
    private String message;
    private List<ProvinceDTO> data;
}
