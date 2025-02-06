package com.example.sep490.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class CookiesUtils {

    // Lấy cookie theo tên
    public Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(cookie -> name.equals(cookie.getName()))
                    .findFirst();
        }
        return Optional.empty();
    }

    // Set cookie
    public void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/"); // Cookie áp dụng cho toàn bộ domain
        cookie.setHttpOnly(true); // Ngăn JavaScript truy cập (bảo mật hơn)
        cookie.setMaxAge(maxAge); // Thời gian sống của cookie (giây)
        response.addCookie(cookie);
    }

    // Xóa cookie bằng cách set MaxAge = 0
    public void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // Hết hạn ngay lập tức
        response.addCookie(cookie);
    }
    
    
//    @Autowired
//    private CookieService cookieService;
//
//    // API set cookie
//    @GetMapping("/set")
//    public String setCookie(HttpServletResponse response) {
//        cookieService.setCookie(response, "userToken", "abc123", 3600); // Sống 1 giờ
//        return "Cookie set successfully!";
//    }
}
