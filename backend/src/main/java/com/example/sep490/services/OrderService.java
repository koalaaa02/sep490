package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.entities.*;
import com.example.sep490.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.OrderRequest;
import com.example.sep490.dto.OrderResponse;
import com.example.sep490.mapper.OrderMapper;
import com.example.sep490.entities.Order;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ShopRepository shopRepo;
    @Autowired
    private ShippingAddressRepository shippingAddressRepo;

    public PageResponse<Order> getOrders(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Order> orderPage = orderRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(orderPage);
    }

    public OrderResponse getOrderById(Long id) {
        Optional<Order> Order = orderRepo.findByIdAndIsDeleteFalse(id);
        if (Order.isPresent()) {
            return orderMapper.EntityToResponse(Order.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public OrderResponse createOrder(OrderRequest orderRequest) {
        User user = getUser(orderRequest.getUserId());
        Shop shop = getShop(orderRequest.getShopId());
        ShippingAddress shippingAddress = getShippingAddres(orderRequest.getShippingAddressId());

        Order entity = orderMapper.RequestToEntity(orderRequest);
        entity.setUser(user);
        entity.setShop(shop);
        entity.setShippingAddress(shippingAddress);
        return orderMapper.EntityToResponse(orderRepo.save(entity));
    }

    public OrderResponse updateOrder(Long id, OrderRequest orderRequest) {
        Order Order = orderRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        User user = getUser(orderRequest.getUserId());
        Shop shop = getShop(orderRequest.getShopId());
        ShippingAddress shippingAddress = getShippingAddres(orderRequest.getShippingAddressId());

        Order entity = orderMapper.RequestToEntity(orderRequest);
        entity.setUser(user);
        entity.setShop(shop);
        entity.setShippingAddress(shippingAddress);
        Order updatedOrder = orderRepo.save(entity);
        return orderMapper.EntityToResponse(updatedOrder);

    }

    public void deleteOrder(Long id) {
        Order updatedOrder = orderRepo.findByIdAndIsDeleteFalse(id)
                .map(existingOrder -> {
                    existingOrder.setDelete(true);
                    return orderRepo.save(existingOrder);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private Order getOrder(Long id) {
        return id == null ? null
                : orderRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private User getUser(Long id) {
        return id == null ? null
                : userRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Shop getShop(Long id) {
        return id == null ? null
                : shopRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private ShippingAddress getShippingAddres(Long id) {
        return id == null ? null
                : shippingAddressRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}