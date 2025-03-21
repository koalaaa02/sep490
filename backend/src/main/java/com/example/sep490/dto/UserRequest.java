package com.example.sep490.dto;
import com.example.sep490.entity.Role;
import jakarta.annotation.Nullable;
import org.hibernate.annotations.ColumnDefault;
import com.example.sep490.entity.Shop;
import com.example.sep490.entity.enums.UserType;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
	private Long id;
    private String name;//username
    private String firstName;
    private String lastName;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    private String password;
    
    @Column(nullable = false)
    @ColumnDefault("true")
    private boolean active = true;
    
    private List<Role> roles;

    private UserType userType = UserType.ROLE_DEALER; // DEALER, PROVIDER, AGENT


    // Relationship
//    @Nullable
//    private Long shopId;
}
//*