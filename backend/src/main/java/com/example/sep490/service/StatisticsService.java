package com.example.sep490.service;
import com.example.sep490.dto.ProductSKUResponse;
import com.example.sep490.entity.Order;
import com.example.sep490.entity.OrderDetail;
import com.example.sep490.entity.ProductSKU;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.mapper.ProductSKUMapper;
import com.example.sep490.repository.OrderDetailRepository;
import com.example.sep490.repository.OrderRepository;
import com.example.sep490.repository.ProductSKURepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class StatisticsService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductSKURepository productSKURepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository; // Để lấy dữ liệu sản phẩm đã bán
    @Autowired
    private ProductSKUMapper productSKUMapper;

    // Lấy thống kê đơn hàng (gốc)
    public Map<String, Object> getOrderStatistics(Long sellerId) {
        // Lấy tất cả đơn hàng của seller
        List<Order> orders = orderRepository.findByShopIdAndIsDeleteFalse(sellerId);
        int totalOrders = orders.size();

        long ordersDelivered = orders.stream()
                .filter(order -> OrderStatus.DELIVERED.equals(order.getStatus())).count();
        long ordersCancelled = orders.stream()
                .filter(order -> OrderStatus.CANCELLED.equals(order.getStatus())).count();
        long ordersReturned = orders.stream()
                .filter(order -> OrderStatus.PENDING.equals(order.getStatus())).count();

        BigDecimal totalOrderValue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalOrders", totalOrders);
        statistics.put("ordersDelivered", ordersDelivered);
        statistics.put("ordersCancelled", ordersCancelled);
        statistics.put("ordersReturned", ordersReturned);
        statistics.put("totalOrderValue", totalOrderValue);

        // Tính tỷ lệ hoàn/trả (%)
        double returnRate = totalOrders > 0 ? (ordersReturned * 100.0) / totalOrders : 0;
        statistics.put("returnRate", returnRate);

        return statistics;
    }

    // Biểu đồ cột: Số đơn hàng theo ngày
    public Map<String, Integer> getOrderStatisticsByPeriod(Long sellerId, Integer month, Integer year) {
        LinkedHashMap<String, Integer> statisticsMap = new LinkedHashMap<>();

        if (month == null || year == null) {
            // Initialize map with all months and set counts to 0
            initializeMonthlyStatistics(statisticsMap);

            // Fetch data grouped by month
            List<Object[]> monthlyData = orderRepository.getOrderStatisticsByYear(sellerId, year);
            for (Object[] result : monthlyData) {
                String monthName = getMonthName(((Number) result[0]).intValue()); // Convert Long to int
                statisticsMap.put(monthName, ((Number) result[1]).intValue()); // Update with actual count
            }
        } else {
            // Initialize map with all days of the given month and set counts to 0
            initializeDailyStatistics(statisticsMap, month);

            // Fetch data grouped by day
            List<Object[]> dailyData = orderRepository.getOrderStatisticsByMonth(sellerId, month, year);
            for (Object[] result : dailyData) {
                String day = String.valueOf(((Number) result[0]).intValue()); // Convert Long to int
                statisticsMap.put(day, ((Number) result[1]).intValue()); // Update with actual count
            }
        }

        return statisticsMap;
    }

    private void initializeMonthlyStatistics(Map<String, Integer> statisticsMap) {
        statisticsMap.put("jan", 0);
        statisticsMap.put("feb", 0);
        statisticsMap.put("march", 0);
        statisticsMap.put("april", 0);
        statisticsMap.put("may", 0);
        statisticsMap.put("june", 0);
        statisticsMap.put("july", 0);
        statisticsMap.put("aug", 0);
        statisticsMap.put("sept", 0);
        statisticsMap.put("oct", 0);
        statisticsMap.put("nov", 0);
        statisticsMap.put("dec", 0);
    }

    private void initializeDailyStatistics(Map<String, Integer> statisticsMap, int month) {
        int daysInMonth = getDaysInMonth(month);

        for (int i = 1; i <= daysInMonth; i++) {
            statisticsMap.put(String.valueOf(i), 0);
        }
    }

    private String getMonthName(int month) {
        return switch (month) {
            case 1 -> "jan";
            case 2 -> "feb";
            case 3 -> "march";
            case 4 -> "april";
            case 5 -> "may";
            case 6 -> "june";
            case 7 -> "july";
            case 8 -> "aug";
            case 9 -> "sept";
            case 10 -> "oct";
            case 11 -> "nov";
            case 12 -> "dec";
            default -> "unknown";
        };
    }

    private int getDaysInMonth(int month) {
        return switch (month) {
            case 1, 3, 5, 7, 8, 10, 12 -> 31;
            case 4, 6, 9, 11 -> 30;
            case 2 -> 28; // Assuming no leap year check for simplicity
            default -> 0; // Invalid month
        };
    }




    /**
     * Lấy danh sách số lượng tồn kho của tất cả sản phẩm.
     */
    public Map<String, Integer> getProductInventoryStatistics() {
        List<ProductSKU> skus = productSKURepository.findAll();
        Map<String, Integer> inventoryStats = new HashMap<>();
        for (ProductSKU sku : skus) {
            String productName = sku.getProduct().getName();
            inventoryStats.put(productName +"-"+sku.getSkuCode(), sku.getStock());
        }
        return inventoryStats;
    }

    /**
     * Thống kê số lượng bán của từng sản phẩm theo khoảng thời gian.
     */
    public Map<String, Integer> getProductSalesStatistics(LocalDateTime from, LocalDateTime to) {
        List<OrderDetail> orderItems = orderDetailRepository.findByCreatedAtBetween(from, to);
        Map<String, Integer> salesStats = new HashMap<>();
        for (OrderDetail item : orderItems) {
            String productName = item.getProductSku().getProduct().getName();
            String skuCode = item.getProductSku().getSkuCode();
            salesStats.put(productName+"-" +skuCode, salesStats.getOrDefault(skuCode, 0) + item.getQuantity());
        }
        return salesStats;
    }

    /**
     * Lấy sản phẩm tồn kho lâu nhất.
     */
    public List<ProductSKUResponse> getLongTermInventoryProducts(int daysThreshold) {
        LocalDateTime thresholdDate = LocalDateTime.now().minusDays(daysThreshold);
        List<ProductSKU> productSKUs = productSKURepository.findByUpdatedAtBefore(thresholdDate);
        List<ProductSKUResponse> productSKUResponse = productSKUMapper.entityToResponses(productSKUs);
        return productSKUResponse;
    }

    /**
     * Lấy sản phẩm gần hết số lượng
     */
    public List<ProductSKUResponse> getNearlyOutOfStockInventoryProducts(int stock) {
        List<ProductSKU> productSKUs = productSKURepository.findByStockLessThanAndStockGreaterThan(stock,0);
        List<ProductSKUResponse> productSKUResponse = productSKUMapper.entityToResponses(productSKUs);
        return productSKUResponse;
    }

    /**
     * Lấy sản phẩm đã hết hàng.
     */
    public List<ProductSKUResponse> getOutOfStockInventoryProducts() {
        List<ProductSKU> productSKUs = productSKURepository.findByStock(0);
        List<ProductSKUResponse> productSKUResponse = productSKUMapper.entityToResponses(productSKUs);
        return productSKUResponse;
    }

    /**
     * Lấy danh sách sản phẩm bán chạy nhất / ít bán nhất.
     */
    public Map<String, Integer> getTopSellingProducts(int limit, boolean isMostSold) {
        List<Object[]> results = isMostSold
                ? productSKURepository.findTopSellingProducts(limit)
                : productSKURepository.findLeastSellingProducts(limit);
        Map<String, Integer> topProducts = new LinkedHashMap<>();
        for (Object[] result : results) {
            topProducts.put((String) result[0], ((Number) result[1]).intValue());
        }
        return topProducts;
    }

}