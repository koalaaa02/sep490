package com.example.sep490.services;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.*;
import com.example.sep490.repositories.*;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private ObjectMapper objectMapper;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private TransactionRepository transactionRepo;
    @Autowired
    private AddressRepository AddressRepo;
    @Autowired
    private ShopRepository shopRepo;

    public PageResponse<OrderResponse> getOrders(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Order> orderPage = orderRepo.findByIsDeleteFalse(pageable);
        Page<OrderResponse> orderResponsePage = orderPage.map(orderMapper::EntityToResponse);
        return pagination.createPageResponse(orderResponsePage);
    }

    public OrderResponse getOrderById(Long id) {
        Optional<Order> Order = orderRepo.findByIdAndIsDeleteFalse(id);
        if (Order.isPresent()) {
            return orderMapper.EntityToResponse(Order.get());
        } else {
            throw new RuntimeException("Đơn hàng không tồn tại với ID: " + id);
        }
    }

    public List<OrderResponse> getOrdersByCreatedBy(Long id) {
        List<Order> orders = orderRepo.findByCreatedByAndIsDeleteFalse(id);
        List<OrderResponse> orderResponses = orderMapper.EntitiesToResponses(orders);
        return orderResponses;
    }

//    public OrderResponse createOrder(OrderRequest orderRequest) {
//        Transaction transaction = getTransaction(orderRequest.getTransactionId());
//        Shop shop = getShop(orderRequest.getShopId());
//        Address Address = getShippingAddres(orderRequest.getAddressId());
//
//        Order entity = orderMapper.RequestToEntity(orderRequest);
//        entity.setTransaction(transaction);
//        entity.setShop(shop);
//        entity.setAddress(Address);
//        return orderMapper.EntityToResponse(orderRepo.save(entity));
//    }

    public Order createOrder(OrderRequest orderRequest) {
        Transaction transaction = getTransaction(orderRequest.getTransactionId());
        Shop shop = getShop(orderRequest.getShopId());
        Address address = getShippingAddres(orderRequest.getAddressId());
        if(shop == null) throw new RuntimeException("Thiếu thông tin shop.");
        if(address == null) throw new RuntimeException("Thiếu thông tin giao hàng.");
        Order entity = orderMapper.RequestToEntity(orderRequest);
        entity.setTransaction(transaction);
        entity.setShop(shop);
        entity.setAddress(address);
        return orderRepo.save(entity);
    }

    public OrderResponse updateOrder(Long id, OrderRequest orderRequest) {
        Order order = orderRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        Transaction transaction = getTransaction(orderRequest.getTransactionId());
        Shop shop = getShop(orderRequest.getShopId());
        Address Address = getShippingAddres(orderRequest.getAddressId());

        try {
            objectMapper.updateValue(order, orderRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        order.setTransaction(transaction);
        order.setShop(shop);
        order.setAddress(Address);
        return orderMapper.EntityToResponse(orderRepo.save(order));
    }

    public OrderResponse updateOrderStatus(Long orderId,Long userId, OrderRequest orderRequest) {
        Order order = orderRepo.findByIdAndIsDeleteFalse(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại với ID: " + orderId));
        order.setStatus(orderRequest.getStatus());
        Order updatedOrder = orderRepo.save(order);
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
    private Transaction getTransaction(Long id) {
        return id == null ? null
                : transactionRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Shop getShop(Long id) {
        return id == null ? null
                : shopRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Address getShippingAddres(Long id) {
        return id == null ? null
                : AddressRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}