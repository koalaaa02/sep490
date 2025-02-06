package com.example.sep490.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopRequest {
	private Long id;

    private String name; 

    @NotNull
    private Long managerId;
    private String secretA; 
    private String secretB; 
}
//*
