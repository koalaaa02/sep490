package com.example.sep490.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.example.sep490.entity.*;
import com.example.sep490.entity.enums.DeliveryMethod;
import com.example.sep490.entity.enums.InvoiceStatus;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.entity.enums.PaymentMethod;
import com.example.sep490.repository.*;
import com.example.sep490.repository.specifications.OrderFilterDTO;
import com.example.sep490.repository.specifications.OrderSpecification;
import com.example.sep490.utils.CommonUtils;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.OrderRequest;
import com.example.sep490.dto.OrderResponse;
import com.example.sep490.mapper.OrderMapper;
import com.example.sep490.entity.Order;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import org.springframework.transaction.annotation.Transactional;

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
    @Autowired
    private UserService userService;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private CommonUtils commonUtils;

    public PageResponse<OrderResponse> getOrdersPublicFilter(OrderFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<Order> spec = OrderSpecification.filterOrders(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Order> orderPage = orderRepo.findAll(spec, pageable);
        Page<OrderResponse> orderResponsePage = orderPage.map(orderMapper::EntityToResponse);
        return pagination.createPageResponse(orderResponsePage);
    }

    public PageResponse<OrderResponse> getOrdersFilter(OrderFilterDTO filter) {
        Shop shop = userService.getShopByContextUser();
        if(shop == null ) throw new RuntimeException("Không tìm thấy cửa hàng.");
        filter.setShopId(shop.getId());
        Specification<Order> spec = OrderSpecification.filterOrders(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Order> orderPage = orderRepo.findAll(spec, pageable);
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

    public OrderResponse getOrderByIdCustomer(Long id) {
        Optional<Order> Order = orderRepo.findByOrderIdAndUserId(id,userService.getContextUser().getId());
        if (Order.isPresent()) {
            return orderMapper.EntityToResponse(Order.get());
        } else {
            throw new RuntimeException("Đơn hàng không tồn tại với ID: " + id);
        }
    }

//    public List<OrderResponse> getOrdersByCreatedBy(Long id) {
//        List<Order> orders = orderRepo.findByCreatedByAndIsDeleteFalse(id);
//        List<OrderResponse> orderResponses = orderMapper.entityToResponses(orders);
//        return orderResponses;
//    }

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
        Shop shop = getShop(orderRequest.getShopId());
        Address address = getShippingAddres(orderRequest.getAddressId());
        if(shop == null) throw new RuntimeException("Thiếu thông tin shop.");
        if(address == null) throw new RuntimeException("Thiếu thông tin giao hàng.");
        Order entity = orderMapper.RequestToEntity(orderRequest);
        entity.setOrderCode(commonUtils.randomString(10));
        entity.setOrderDate(LocalDateTime.now());
        entity.setShop(shop);
        entity.setAddress(address);
        return orderRepo.save(entity);
    }

    public OrderResponse updateOrder(Long id, OrderRequest orderRequest) {
        Order order = orderRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại với ID: " + id));

        Shop shop = getShop(orderRequest.getShopId());
        Address Address = getShippingAddres(orderRequest.getAddressId());

        try {
            objectMapper.updateValue(order, orderRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        order.setShop(shop);
        order.setAddress(Address);
        return orderMapper.EntityToResponse(orderRepo.save(order));
    }

    public OrderResponse changeOrderStatusForDealer(Long orderId, OrderStatus orderStatus) {
        Order order = orderRepo.findByIdAndIsDeleteFalse(orderId)
            .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại với ID: " + orderId));
        order.setStatus(orderStatus);
        Order updatedOrder = orderRepo.save(order);
        return orderMapper.EntityToResponse(updatedOrder);
    }

    @Transactional
    public void changeStatusOrdersForProvider(List<Long> orderIds, OrderStatus orderStatus) {
//        List<Invoice> invoices = new ArrayList<>();
        List<Order> orders = orderRepo.findAllById(orderIds).stream()
                .filter(order -> !order.isDelete())
//                .peek(order -> processOrder(order, orderStatus, invoices))
                .peek(order -> {
                    order.setStatus(orderStatus);
                    if(order.getStatus() == OrderStatus.DELIVERED)
                        order.setDeliveryDate(LocalDateTime.now());
                })
                .toList();
        if (orders.isEmpty()) {
            throw new RuntimeException("Không tìm thấy đơn hàng hợp lệ với danh sách ID đã cung cấp");
        }
//        if (!invoices.isEmpty()) {
//            invoiceRepository.saveAll(invoices);
//        }
        orderRepo.saveAll(orders);
    }

    @Transactional
    public void changeStatusOrderForProvider(Long orderId, BigDecimal amount , OrderStatus orderStatus) {
        Order order = getOrder(orderId);
        if (order == null) {
            throw new RuntimeException("Không tìm thấy đơn hàng hợp lệ với ID đã cung cấp");
        }

        if (orderStatus == OrderStatus.DELIVERED) {
            Invoice invoice = Invoice.builder()
                    .invoiceCode(commonUtils.randomString(10))
                    .status(InvoiceStatus.UNPAID)
                    .agent(order.getAddress().getUser())
                    .order(order)
                    .paidAmount(amount == null ? BigDecimal.ZERO: amount)
                    .totalAmount(order.getTotalAmount())
                    .deliveryDate(LocalDateTime.now())
                    .build();
            if(order.getDeliveryMethod() == DeliveryMethod.SELF_DELIVERY){
                if(amount.compareTo(order.getTotalAmount()) < 0) {
                    invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
                    if(order.getPaymentMethod() == PaymentMethod.COD)
                        order.setPaymentMethod(PaymentMethod.DEBT);
                }
                if(amount.compareTo(order.getTotalAmount()) == 0) {
                    invoice.setStatus(InvoiceStatus.PAID);
                    order.setPaid(true);
                }
                invoiceRepository.save(invoice);
            }else if(order.getDeliveryMethod() == DeliveryMethod.GHN){
//                invoice.setPaidAmount(order.getTotalAmount()); neu = GHN, set ve orderPaymentMethod = debt
                order.setPaid(true);
                invoiceRepository.save(invoice);
            }
            order.setDeliveryDate(LocalDateTime.now());
        }
        order.setStatus(orderStatus);
        orderRepo.save(order);
    }


    private void processOrder(Order order, OrderStatus orderStatus, List<Invoice> invoices) {
        order.setStatus(orderStatus);
        if (orderStatus == OrderStatus.DELIVERED) {
            order.setDeliveryDate(LocalDateTime.now());
        }
        if (orderStatus == OrderStatus.ACCEPTED && order.getPaymentMethod() == PaymentMethod.DEBT) {
            invoices.add(
                    Invoice.builder()
                    .invoiceCode(commonUtils.randomString(10))
                    .status(InvoiceStatus.UNPAID)
                    .agent(order.getAddress().getUser())
                    .order(order)
                    .paidAmount(BigDecimal.ZERO)
                    .totalAmount(order.getTotalAmount())
                    .build()
            );
        }
    }

    public void deleteOrder(Long id) {
        Order updatedOrder = orderRepo.findByIdAndIsDeleteFalse(id)
                .map(existingOrder -> {
                    existingOrder.setDelete(true);
                    return orderRepo.save(existingOrder);
                })
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại với ID: " + id));
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