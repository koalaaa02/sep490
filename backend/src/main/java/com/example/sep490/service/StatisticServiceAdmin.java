package com.example.sep490.service;

import com.example.sep490.repository.ShopRepository;
import com.example.sep490.repository.UserRepository;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatisticServiceAdmin {

    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private UserRepository userRepository;

    public Map<String, Long> numberOfShop() {
        long total = shopRepository.count();
        long active = shopRepository.countByActiveTrue();
        long closed = shopRepository.countByCloseTrue();

        Map<String, Long> result = new HashMap<>();
        result.put("totalShops", total);
        result.put("activeShops", active);
        result.put("closedShops", closed);
        return result;
    }

    public long newShopsThisMonth() {
        LocalDateTime now = LocalDateTime.now();
        return shopRepository.countNewShopsInMonth(now.getMonthValue(), now.getYear());
    }

    public long totalUsers() {
        return userRepository.count();
    }

    public Map<String, Long> usersByRole() {
        List<Object[]> result = userRepository.countUsersByRole();
        Map<String, Long> roleCounts = new HashMap<>();
        for (Object[] row : result) {
            roleCounts.put((String) row[0], (Long) row[1]);
        }
        return roleCounts;
    }

    public long newUsers(@Nullable Integer month, @Nullable Integer year) {
        LocalDateTime now = LocalDateTime.now();

        int resolvedMonth = (month != null) ? month : now.getMonthValue();
        int resolvedYear = (year != null) ? year : now.getYear();

        return userRepository.countNewUsersInMonth(resolvedMonth, resolvedYear);
    }


    public BigDecimal revenueInMonth(@Nullable Integer month, @Nullable Integer year) {
        LocalDateTime now = LocalDateTime.now();

        int resolvedMonth = (month != null) ? month : now.getMonthValue();
        int resolvedYear = (year != null) ? year : now.getYear();

        long activeNewShops = shopRepository.countNewActiveShopsInMonth(resolvedMonth, resolvedYear);
        return BigDecimal.valueOf(activeNewShops).multiply(BigDecimal.valueOf(150_000));
    }
}
