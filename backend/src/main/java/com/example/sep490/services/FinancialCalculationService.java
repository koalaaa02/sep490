package com.example.sep490.services;

import com.example.sep490.entities.Order;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.enums.OrderStatus;
import com.example.sep490.repositories.OrderRepository;
import com.example.sep490.repositories.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FinancialCalculationService {
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private OrderRepository orderRepository;


    // Ngày 1: Tính phí sàn và cập nhật số tiền cần đóng
    @Scheduled(cron = "0 0 0 1 * ?") // Chạy vào 00:00 ngày 1 hàng tháng
    public void calculatePlatformFees() {
        int page = 0;
        int pageSize = 1000; // Xử lý 1000 shop mỗi lần
        Page<Shop> shopPage;
        do {
            shopPage = shopRepository.findAll(PageRequest.of(page, pageSize));
            for (Shop shop : shopPage.getContent()) {
                if (shop.isActive()) {
                    BigDecimal monthlyFee = calculateMonthlyFee(shop);
                    shop.setTotalFeeDueAmount(shop.getTotalFeeDueAmount().add(monthlyFee));
                    shopRepository.save(shop); // Chỉ cập nhật từng shop
                }
            }
            page++; // Chuyển sang trang tiếp theo
        } while (shopPage.hasNext());
    }


    // Ngày 5: Nếu chưa thanh toán thì đóng shop
    @Scheduled(cron = "0 0 0 5 * ?") // Chạy vào 00:00 ngày 5 hàng tháng
    public void deactivateUnpaidShops() {
        List<Shop> shops = shopRepository.findAll();

        for (Shop shop : shops) {
            if (shop.getTotalFeeDueAmount().compareTo(BigDecimal.ZERO) > 0) {
                shop.setActive(false); // Đóng shop
            }
        }
        shopRepository.saveAll(shops);
    }

    private BigDecimal calculateMonthlyFee(Shop shop) {
        // Lấy tháng và năm của tháng trước
        LocalDateTime lastMonth = LocalDateTime.now().minusMonths(1);
        // Tính tổng phí sàn từ các đơn hàng đã giao của tháng trước
        return orderRepository.getTotalPlatformFeeByShopAndMonth(shop.getId(), lastMonth.getYear(), lastMonth.getMonthValue());

    }

}
