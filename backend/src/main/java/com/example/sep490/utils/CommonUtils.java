package com.example.sep490.utils;

import org.springframework.stereotype.Service;

import java.util.Random;
@Service
public class CommonUtils {
    public String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++) { // Tạo OTP 6 chữ số
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public String randomString(int length) {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < length; i++) { // Tạo OTP 6 chữ số
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}
