package com.example.sep490.dto.GHN;

import lombok.Data;
import java.util.List;

@Data
public class GHNWardResponse {
    private int code;
    private String message;
    private List<WardDTO> data;
}
