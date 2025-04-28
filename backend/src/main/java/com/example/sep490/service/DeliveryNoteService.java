package com.example.sep490.service;

import com.example.sep490.dto.*;
import com.example.sep490.entity.*;
import com.example.sep490.entity.compositeKeys.OrderDetailId;
import com.example.sep490.entity.enums.InvoiceStatus;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.mapper.DeliveryNoteMapper;
import com.example.sep490.repository.*;
import com.example.sep490.repository.specifications.DeliveryNoteFilterDTO;
import com.example.sep490.repository.specifications.DeliveryNoteSpecification;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.CommonUtils;
import com.example.sep490.utils.PageResponse;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DeliveryNoteService {
    @Autowired
    private DeliveryNoteRepository deliveryNoteRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DeliveryNoteMapper deliveryNoteMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private DeliveryDetailRepository deliveryDetailRepo;
    @Autowired
    private AddressRepository addressRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private DebtPaymentService debtPaymentService;
    @Autowired
    private UserService userService;
    @Autowired
    private CommonUtils commonUtils;


    public PageResponse<DeliveryNoteResponse> getDeliveryNotes(DeliveryNoteFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<DeliveryNote> spec = DeliveryNoteSpecification.filterDeliveryNotes(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<DeliveryNote> deliveryNotePage = deliveryNoteRepo.findAll(spec, pageable);
        Page<DeliveryNoteResponse> deliveryNoteResponsePage = deliveryNotePage.map(deliveryNoteMapper::EntityToResponse);
        return pagination.createPageResponse(deliveryNoteResponsePage);
    }

    public DeliveryNoteResponse getDeliveryNoteById(Long id) {
        Optional<DeliveryNote> DeliveryNote = deliveryNoteRepo.findByIdAndIsDeleteFalse(id);
        if (DeliveryNote.isPresent()) {
            return deliveryNoteMapper.EntityToResponse(DeliveryNote.get());
        } else {
            throw new RuntimeException("Phiếu giao hàng không tồn tại với ID: " + id);
        }
    }

    @Transactional
    public DeliveryNoteResponse createDeliveryNote(DeliveryNoteRequest deliveryNoteRequest) {
        Order order = getOrder(deliveryNoteRequest.getOrderId());
        if(order == null) throw new RuntimeException("Không xác định được đơn hàng cần giao");

        // tạo phiếu giao hàng
        DeliveryNote entity = deliveryNoteMapper.RequestToEntity(deliveryNoteRequest);
        entity.setDeliveryCode(commonUtils.randomString(10));
        entity.setOrder(order);
        entity.setAddress(order.getAddress());
        entity.setDeliveryDetails(null);
        DeliveryNote deliveryNote = deliveryNoteRepo.save(entity);

        // tạo chi tiết phiếu giao hàng (nếu có)
        List<DeliveryDetailRequest> deliveryDetailRequests = deliveryNoteRequest.getDeliveryDetails();
        if (deliveryDetailRequests != null && !deliveryDetailRequests.isEmpty()) {
            List<OrderDetail> orderDetails = order.getOrderDetails();
            Map<OrderDetailId, OrderDetail> orderDetailMap = orderDetails.stream()
                    .collect(Collectors.toMap(OrderDetail::getId, Function.identity()));

            List<DeliveryDetail> deliveryDetails = buildDeliveryDetails(deliveryDetailRequests, orderDetailMap, deliveryNote);
            deliveryNote.setDeliveryDetails(deliveryDetails);

            // tính tổng tiền
            BigDecimal totalAmount = deliveryDetails.stream()
                    .map(detail -> detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            deliveryNote.setTotalAmount(totalAmount);
            deliveryNoteRepo.save(deliveryNote);
        }
        isAllDeliveryDone(order.getId());
        return deliveryNoteMapper.EntityToResponse(deliveryNote);
    }

    @Transactional
    public void isAllDeliveryDone(Long orderId){
        Order order = getOrder(orderId);
        if(order == null) throw new RuntimeException("Không xác định được đơn hàng cần giao");

        List<OrderDetail> orderDetails = order.getOrderDetails();
        List<DeliveryDetail> deliveredDeliveryDetails = deliveryDetailRepo.findByOrderIdAndIsDeleteFalse(orderId);
        for (OrderDetail orderDetail : orderDetails) {
            int totalQuantity = deliveredDeliveryDetails.stream()
                    .filter(d -> d.getOrderDetailId().getSkuId().equals(orderDetail.getId().getSkuId()))
                    .mapToInt(DeliveryDetail::getQuantity)
                    .sum();

            if(orderDetail.getQuantity() != totalQuantity) return ;
        }

        List<DeliveryNote> deliveredDeliveryNotes = deliveryNoteRepo.findByOrderIdAndIsDeleteFalse(orderId);
        BigDecimal totalPaidAmount = deliveredDeliveryNotes.stream()
                .map(DeliveryNote::getTotalAmount)
                .filter(Objects::nonNull) // nếu có khả năng null
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if(totalPaidAmount.compareTo(order.getTotalAmount()) < 0 ){
            InvoiceRequest invoice = InvoiceRequest.builder()
                    .invoiceCode(commonUtils.randomString(10))
                    .status(InvoiceStatus.PARTIALLY_PAID)
                    .orderId(order.getId())
                    .paidAmount(totalPaidAmount.compareTo(BigDecimal.ZERO) > 0 ? totalPaidAmount: BigDecimal.ZERO )
                    .totalAmount(order.getTotalAmount())
                    .deliveryDate(LocalDateTime.now())
                    .build();
            invoiceService.createInvoice(invoice);

            for(DeliveryNote deliveryNote : deliveredDeliveryNotes){
                if(deliveryNote.getTotalAmount().compareTo(BigDecimal.ZERO) > 0){
                    DebtPaymentRequest debtPaymentRequest = DebtPaymentRequest.builder()
                            .invoiceId(invoice.getId())
                            .amountPaid(deliveryNote.getTotalAmount())
                            .paymentDate(deliveryNote.getDeliveredDate())
                            .build();
                    debtPaymentService.createDebtPayment(debtPaymentRequest);
                }
            }
        }
        order.setStatus(OrderStatus.DELIVERED);
        orderRepo.save(order);
    }


    @Transactional
    public DeliveryNoteResponse updateDeliveryNote(Long id, DeliveryNoteRequest deliveryNoteRequest) {
        DeliveryNote deliveryNote = deliveryNoteRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Phiếu thanh toán không tồn tại với ID: " + id));
        Order order = getOrder(deliveryNoteRequest.getOrderId());
        if(order == null) throw new RuntimeException("Không xác định được đơn hàng cần giao");

        try {
            objectMapper.updateValue(deliveryNote, deliveryNoteRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        deliveryNote.setOrder(order);
        deliveryNote.setAddress(order.getAddress());

        return deliveryNoteMapper.EntityToResponse(deliveryNoteRepo.save(deliveryNote));
    }

    private List<DeliveryDetail> buildDeliveryDetails(
            List<DeliveryDetailRequest> deliveryDetailRequests,
            Map<OrderDetailId, OrderDetail> orderDetailMap,
            DeliveryNote deliveryNote
    ) {
        List<DeliveryDetail> deliveryDetails = new LinkedList<>();
        List<DeliveryDetail> oldDeliveryDetails =
                deliveryDetailRepo.findByOrderIdAndIsDeleteFalse(deliveryNote.getOrder().getId());

        for (DeliveryDetailRequest request : deliveryDetailRequests) {
            if (!orderDetailMap.containsKey(request.getOrderDetailId())) continue;

            OrderDetail orderDetail = orderDetailMap.get(request.getOrderDetailId());
            int totalQuantity = oldDeliveryDetails.stream()
                    .filter(d -> d.getOrderDetailId().getSkuId().equals(orderDetail.getId().getSkuId()))
                    .mapToInt(DeliveryDetail::getQuantity)
                    .sum();
            if(totalQuantity + request.getQuantity() > orderDetail.getQuantity())
                throw new RuntimeException("Tổng số lượng giao đã vượt quá số lượng trong đơn hàng");

            DeliveryDetail detail = DeliveryDetail.builder()
                    .productName(orderDetail.getProductSku().getProduct().getName())
                    .productSKUCode(orderDetail.getProductSku().getSkuCode())
                    .unit(orderDetail.getProductSku().getProduct().getUnit().toString())
                    .quantity(request.getQuantity())
                    .price(orderDetail.getProductSku().getSellingPrice())
                    .deliveryNote(deliveryNote)
                    .orderDetailId(request.getOrderDetailId())
                    .build();

            deliveryDetails.add(detail);
        }

        return deliveryDetails;
    }

    public void deleteDeliveryNote(Long id) {
        DeliveryNote updatedDeliveryNote = deliveryNoteRepo.findByIdAndIsDeleteFalse(id)
                .map(existingDeliveryNote -> {
                    existingDeliveryNote.setDelete(true);
                    return deliveryNoteRepo.save(existingDeliveryNote);
                })
                .orElseThrow(() -> new RuntimeException("Phiếu giao hàng không tồn tại với ID: " + id));
    }

    private DeliveryNote getDeliveryNote(Long id) {
        return id == null ? null
                : deliveryNoteRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Address getAdrdess(Long id) {
        return id == null ? null
                : addressRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Order getOrder(Long id) {
        return id == null ? null
                : orderRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}