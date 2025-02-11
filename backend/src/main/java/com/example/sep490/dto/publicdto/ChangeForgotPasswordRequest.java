package com.example.sep490.dto.publicdto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeForgotPasswordRequest {
    private String email;
    private String resetToken;
    private String newPassword;
    private String confirmNewPassword;
}