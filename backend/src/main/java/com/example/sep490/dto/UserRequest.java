package com.example.sep490.dto;
import jakarta.annotation.Nullable;
import org.hibernate.annotations.ColumnDefault;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.enums.UserType;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
	private Long id;
    
    private String name;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    private String password;
    
    @Column(nullable = false)
    @ColumnDefault("true")
    private boolean isActive = true;
    
    private String roles = "ROLE_CUSTOMER";

    private UserType userType = UserType.ROLE_CUSTOMER; // CUSTOMER, SELLER, AGENT

//    @Nullable
//    private Long shopId;
}
//*