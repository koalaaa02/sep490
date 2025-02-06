package com.example.sep490.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailRequest {
	@NotNull
    private Long orderId;

    @NotNull 
    private Long productSkuId;
    private int quantity;
    
    @NotNull(message = "Số tiền không được để trống.")
    @DecimalMin(value = "0.00", message = "Số tiền phải >= 0.")
    private BigDecimal price;
}
