package com.example.sep490.service;

import com.example.sep490.dto.DeliveryDetailRequest;
import com.example.sep490.dto.DeliveryDetailResponse;
import com.example.sep490.entity.*;
import com.example.sep490.entity.compositeKeys.OrderDetailId;
import com.example.sep490.mapper.DeliveryDetailMapper;
import com.example.sep490.repository.*;
import com.example.sep490.repository.specifications.DeliveryDetailFilterDTO;
import com.example.sep490.repository.specifications.DeliveryDetailSpecification;
import com.example.sep490.utils.BasePagination;
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

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class DeliveryDetailService {
    @Autowired
    private DeliveryDetailRepository deliveryDetailRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DeliveryDetailMapper deliveryDetailMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private DeliveryNoteRepository deliveryNoteRepo;
    @Autowired
    private OrderDetailRepository orderDetailRepo;
    @Autowired
    private UserService userService;

    public PageResponse<DeliveryDetailResponse> getDeliveryDetails(DeliveryDetailFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<DeliveryDetail> spec = DeliveryDetailSpecification.filterDeliveryDetails(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<DeliveryDetail> deliveryDetailPage = deliveryDetailRepo.findAll(spec, pageable);
        Page<DeliveryDetailResponse> deliveryDetailResponsePage = deliveryDetailPage.map(deliveryDetailMapper::EntityToResponse);
        return pagination.createPageResponse(deliveryDetailResponsePage);
    }

    public DeliveryDetailResponse getDeliveryDetailById(Long id) {
        Optional<DeliveryDetail> DeliveryDetail = deliveryDetailRepo.findByIdAndIsDeleteFalse(id);
        if (DeliveryDetail.isPresent()) {
            return deliveryDetailMapper.EntityToResponse(DeliveryDetail.get());
        } else {
            throw new RuntimeException("Chi tiết phiếu giao hàng không tồn tại với ID: " + id);
        }
    }

    public DeliveryDetailResponse createDeliveryDetail(DeliveryDetailRequest deliveryDetailRequest) {
        DeliveryNote deliveryNote = getDeliveryNote(deliveryDetailRequest.getDeliveryNoteId());
        OrderDetail orderDetail = getOrderDetail(deliveryDetailRequest.getOrderDetailId());
        if(deliveryNote == null) throw new RuntimeException("Không xác định được phiếu giao hàng");
        if(orderDetail == null) throw new RuntimeException("Không xác định được chi tiết đơn hàng");

        DeliveryDetail entity = deliveryDetailMapper.RequestToEntity(deliveryDetailRequest);

        entity.setProductName(orderDetail.getProductSku().getProduct().getName());
        entity.setProductSKUCode(orderDetail.getProductSku().getSkuCode());
        entity.setUnit(orderDetail.getProductSku().getProduct().getUnit().toString());
        entity.setQuantity(deliveryDetailRequest.getQuantity());
        entity.setPrice(orderDetail.getPrice());
        entity.setDeliveryNote(deliveryNote);
        entity.setOrderDetailId(orderDetail.getId());

        checkQuantityInOrderDetail(deliveryNote, deliveryDetailRequest, orderDetail);
        deliveryDetailRepo.save(entity);
        updateDeliveryNoteTotalAmount(deliveryDetailRequest.getDeliveryNoteId());
        return deliveryDetailMapper.EntityToResponse(entity);
    }

    @Transactional
    public DeliveryDetailResponse updateDeliveryDetail(Long id, DeliveryDetailRequest deliveryDetailRequest) {
        DeliveryDetail deliveryDetail = deliveryDetailRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Chi tiết phiếu giao hàng không tồn tại với ID: " + id));
        DeliveryNote deliveryNote = getDeliveryNote(deliveryDetailRequest.getDeliveryNoteId());
        OrderDetail orderDetail = getOrderDetail(deliveryDetailRequest.getOrderDetailId());
        if(deliveryNote == null) throw new RuntimeException("Không xác định được phiếu giao hàng");
        if(orderDetail == null) throw new RuntimeException("Không xác định được chi tiết đơn hàng");

        try {
            objectMapper.updateValue(deliveryDetail, deliveryDetailRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }

        deliveryDetail.setProductName(orderDetail.getProductSku().getProduct().getName());
        deliveryDetail.setProductSKUCode(orderDetail.getProductSku().getSkuCode());
        deliveryDetail.setUnit(orderDetail.getProductSku().getProduct().getUnit().toString());
        deliveryDetail.setQuantity(deliveryDetailRequest.getQuantity());
        deliveryDetail.setPrice(orderDetail.getPrice());
        deliveryDetail.setDeliveryNote(deliveryNote);
        deliveryDetail.setOrderDetailId(orderDetail.getId());

        checkQuantityInOrderDetail(deliveryNote, deliveryDetailRequest, orderDetail);
        deliveryDetailRepo.save(deliveryDetail);
        updateDeliveryNoteTotalAmount(deliveryDetailRequest.getDeliveryNoteId());
        return deliveryDetailMapper.EntityToResponse(deliveryDetail);
    }

    private void checkQuantityInOrderDetail(DeliveryNote deliveryNote, DeliveryDetailRequest deliveryDetailRequest, OrderDetail orderDetail) {
        List<DeliveryDetail> oldDeliveryDetails =
                deliveryDetailRepo.findByOrderIdAndIsDeleteFalse(deliveryNote.getOrder().getId());
        int totalQuantity = oldDeliveryDetails.stream()
                .filter(d ->
                        d.getOrderDetailId().getSkuId().equals(orderDetail.getId().getSkuId()) &&
                                !Objects.equals(d.getId(), deliveryDetailRequest.getId())
                )
                .mapToInt(DeliveryDetail::getQuantity)
                .sum();
        if(totalQuantity + deliveryDetailRequest.getQuantity() > orderDetail.getQuantity())
            throw new RuntimeException("Tổng số lượng giao đã vượt quá số lượng trong đơn hàng");
    }

    private void updateDeliveryNoteTotalAmount(Long deliveryNoteId){
        deliveryDetailRepo.updateTotalAmountByDeliveryNoteId(deliveryNoteId);
    }
    
    public void deleteDeliveryDetail(Long id) {
        DeliveryDetail updatedDeliveryDetail = deliveryDetailRepo.findByIdAndIsDeleteFalse(id)
                .map(existingDeliveryDetail -> {
                    existingDeliveryDetail.setDelete(true);
                    return deliveryDetailRepo.save(existingDeliveryDetail);
                })
                .orElseThrow(() -> new RuntimeException("Chi tiết phiếu giao hàng không tồn tại với ID: " + id));
    }

    private DeliveryDetail getDeliveryDetail(Long id) {
        return id == null ? null
                : deliveryDetailRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private DeliveryNote getDeliveryNote(Long id) {
        return id == null ? null
                : deliveryNoteRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private OrderDetail getOrderDetail(OrderDetailId id) {
        return id == null ? null
                : orderDetailRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}