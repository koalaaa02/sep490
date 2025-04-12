package com.example.sep490.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccountRequest {
    private Long id;
    @NotBlank(message = "Tên ngân hàng không được để trống")
    private String bankName;
    @NotBlank(message = "Số tài khoản không được để trống")
    @Pattern(regexp = "\\d{8,20}", message = "Số tài khoản không hợp lệ")
    private String accountNumber;
    @NotBlank(message = "Tên chủ tài khoản không được để trống")
    private String accountHolderName;
    @Schema(defaultValue = "false")
    private boolean defaultBankAccount = false;
}
