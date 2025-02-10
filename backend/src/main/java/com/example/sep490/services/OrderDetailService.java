package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.entities.*;
import com.example.sep490.entities.compositeKeys.OrderDetailId;
import com.example.sep490.repositories.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.OrderDetailRequest;
import com.example.sep490.dto.OrderDetailResponse;
import com.example.sep490.mapper.OrderDetailMapper;
import com.example.sep490.entities.OrderDetail;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class OrderDetailService {
    @Autowired
    private OrderDetailRepository orderDetailRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private OrderDetailMapper orderDetailMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private ProductSKURepository productRepo;

    public PageResponse<OrderDetailResponse> getOrderDetails(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<OrderDetail> orderDetailPage = orderDetailRepo.findByIsDeleteFalse(pageable);
        Page<OrderDetailResponse> orderDetailResponsePage = orderDetailPage.map(orderDetailMapper::EntityToResponse);
        return pagination.createPageResponse(orderDetailResponsePage);
    }

    public OrderDetailResponse getOrderDetailById(Long orderId,Long productSKUId) {
        Optional<OrderDetail> OrderDetail = orderDetailRepo.findByIdAndIsDeleteFalse(new OrderDetailId(orderId, productSKUId));
        if (OrderDetail.isPresent()) {
            return orderDetailMapper.EntityToResponse(OrderDetail.get());
        } else {
            throw new RuntimeException(
                    String.format("Danh mục không tồn tại với mã đơn hàng %s, mã sản phẩm %s",
                            orderId.toString(), productSKUId.toString()
                    )
            );
        }
    }

    public OrderDetailResponse createOrderDetail(OrderDetailRequest orderDetailRequest) {
        Order order = getOrder(orderDetailRequest.getOrderId());
        ProductSKU productSKU = getProductSKU(orderDetailRequest.getProductSkuId());

        OrderDetail entity = orderDetailMapper.RequestToEntity(orderDetailRequest);
        entity.setOrder(order);
        entity.setProductSku(productSKU);
        return orderDetailMapper.EntityToResponse(orderDetailRepo.save(entity));
    }

    public void createOrderDetail(OrderDetail orderDetail) {
        orderDetailRepo.save(orderDetail);
    }

    public OrderDetailResponse updateOrderDetail(OrderDetailRequest orderDetailRequest) {
        Long orderId = orderDetailRequest.getOrderId();
        Long productSKUId = orderDetailRequest.getProductSkuId();
        OrderDetail OrderDetail =
                orderDetailRepo.findByIdAndIsDeleteFalse(new OrderDetailId(orderId, productSKUId))
                .orElseThrow(() -> new RuntimeException(
                        String.format("Danh mục không tồn tại với mã đơn hàng %s, mã sản phẩm %s",
                                orderId.toString(), productSKUId.toString()
                        )));

        Order order = getOrder(orderDetailRequest.getOrderId());
        ProductSKU productSKU = getProductSKU(orderDetailRequest.getProductSkuId());

        OrderDetail entity = orderDetailMapper.RequestToEntity(orderDetailRequest);
        entity.setOrder(order);
        entity.setProductSku(productSKU);
        OrderDetail updatedOrderDetail = orderDetailRepo.save(entity);
        return orderDetailMapper.EntityToResponse(updatedOrderDetail);

    }

    public void deleteOrderDetail(Long orderId,Long productSKUId) {
        OrderDetail updatedOrderDetail = orderDetailRepo.findByIdAndIsDeleteFalse(new OrderDetailId(orderId, productSKUId))
                .map(existingOrderDetail -> {
                    existingOrderDetail.setDelete(true);
                    return orderDetailRepo.save(existingOrderDetail);
                })
                .orElseThrow(() -> new RuntimeException(
                        String.format("Danh mục không tồn tại với mã đơn hàng %s, mã sản phẩm %s",
                                orderId.toString(), productSKUId.toString()
                        )
                ));
    }

    private OrderDetail getOrderDetail(Long orderId,Long productSKUId) {
        return orderId == null || productSKUId == null ? null
                : orderDetailRepo.findByIdAndIsDeleteFalse(new OrderDetailId(orderId, productSKUId)).orElse(null);
    }
    private Order getOrder(Long id) {
        return id == null ? null
                : orderRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private ProductSKU getProductSKU(Long id) {
        return id == null ? null
                : productRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}