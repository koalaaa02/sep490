package com.example.sep490.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.sep490.dto.*;
import com.example.sep490.entity.*;
import com.example.sep490.entity.enums.PaymentMethod;
import com.example.sep490.repository.*;
import com.example.sep490.repository.specifications.FilterDTO;
import com.example.sep490.repository.specifications.InvoiceFilterDTO;
import com.example.sep490.repository.specifications.InvoiceSpecification;
import com.example.sep490.utils.CommonUtils;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.sep490.mapper.InvoiceMapper;
import com.example.sep490.entity.Invoice;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private InvoiceMapper invoiceMapper;
    @Autowired
    private BasePagination pagination;
    @Autowired
    private CommonUtils commonUtils;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private DebtPaymentService debtPaymentService;
    @Autowired
    private ShopRepository shopRepository;

    public PageResponse<InvoiceResponse> getInvoices(InvoiceFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<Invoice> spec = InvoiceSpecification.filterInvoices(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Invoice> invoicePage = invoiceRepo.findAll(spec, pageable);
        Page<InvoiceResponse> invoiceResponsePage = invoicePage.map(invoiceMapper::EntityToResponse);
        return pagination.createPageResponse(invoiceResponsePage);
    }

    public PageResponse<InvoiceResponse> getInvoicesByUserId(InvoiceFilterDTO filter) {
        filter.setAgentId(userService.getContextUser().getId());
        Specification<Invoice> spec = InvoiceSpecification.filterInvoices(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Invoice> invoicePage = invoiceRepo.findAll(spec, pageable);
        Page<InvoiceResponse> invoiceResponsePage = invoicePage.map(invoiceMapper::EntityToResponse);
        return pagination.createPageResponse(invoiceResponsePage);
    }

    public PageResponse<InvoiceResponse> getInvoicesByDealerId(InvoiceFilterDTO filter, Long dealerId) {
        filter.setCreatedBy(userService.getContextUser().getId());
        filter.setAgentId(dealerId);
        Specification<Invoice> spec = InvoiceSpecification.filterInvoices(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Invoice> invoicePage = invoiceRepo.findAll(spec, pageable);
        Page<InvoiceResponse> invoiceResponsePage = invoicePage.map(invoiceMapper::EntityToResponse);
        return pagination.createPageResponse(invoiceResponsePage);
    }

    public List<UserInvoiceSummary> getUsersWithInvoicesCreatedBy(FilterDTO filter) {
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        return invoiceRepo.findAllUserAndCountInvoiceByCreatedBy(userService.getContextUser().getId(), pageable);
    }

    public List<ShopInvoiceSummary> getShopsWithInvoices(FilterDTO filter) {
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        return invoiceRepo.findAllShopAndCountInvoiceByAgentID(userService.getContextUser().getId(), pageable);
    }

    public List<InvoiceResponse> getShopsInvoicesByShopIdAndDealerId(Long shopId) {
        Long agentId = userService.getContextUser().getId();
        return invoiceMapper.entityToResponses(invoiceRepo.findByShopIdAndAgentId(shopId, agentId));
    }

    public InvoiceResponse getInvoiceById(Long id) {
        Optional<Invoice> Invoice = invoiceRepo.findByIdAndIsDeleteFalse(id);
        if (Invoice.isPresent()) {
            return invoiceMapper.EntityToResponse(Invoice.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public InvoiceResponse createInvoice(InvoiceRequest invoiceRequest) {
        Order order = getOrder(invoiceRequest.getOrderId());
        if(order == null) throw new RuntimeException("Không tìm thấy hóa đơn.");
        User user = getUser(order.getAddress().getUser().getId());
        if(user == null) throw new RuntimeException("Không tìm thấy người nợ.");

        if(order.getPaymentMethod() == PaymentMethod.COD){
            order.setPaymentMethod(PaymentMethod.DEBT);
            orderRepo.save(order);
        }
        Invoice entity = invoiceMapper.RequestToEntity(invoiceRequest);
        entity.setInvoiceCode(commonUtils.randomString(10));
        entity.setAgent(user);
        entity.setOrder(order);
        invoiceRepo.save(entity);

        if(entity.getPaidAmount().compareTo(BigDecimal.ZERO) > 0
                && entity.getPaidAmount().compareTo(order.getTotalAmount()) <0){
            DebtPaymentRequest debtPaymentRequest = DebtPaymentRequest.builder()
                    .invoiceId(entity.getId())
                    .amountPaid(entity.getPaidAmount())
                    .paymentDate(LocalDateTime.now())
                    .build();
            debtPaymentService.createDebtPayment(debtPaymentRequest);
        }
        return invoiceMapper.EntityToResponse(entity);
    }

    public InvoiceResponse updateInvoice(Long id, InvoiceRequest invoiceRequest) {
        Invoice invoice = invoiceRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        Order order = getOrder(invoiceRequest.getOrderId());
        if(order == null) throw new RuntimeException("Không tìm thấy hóa đơn.");
        User user = getUser(invoice.getAgent().getId());
        if(user == null) throw new RuntimeException("Không tìm thấy người nợ.");

        try {
            objectMapper.updateValue(invoice, invoiceRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        invoice.setAgent(user);
        invoice.setOrder(order);
        return invoiceMapper.EntityToResponse(invoiceRepo.save(invoice));


    }

    public void deleteInvoice(Long id) {
        Invoice updatedInvoice = invoiceRepo.findByIdAndIsDeleteFalse(id)
                .map(existingInvoice -> {
                    existingInvoice.setDelete(true);
                    return invoiceRepo.save(existingInvoice);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private Invoice getInvoice(Long id) {
        return id == null ? null
                : invoiceRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Order getOrder(Long id) {
        return id == null ? null
                : orderRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private User getUser(Long id) {
        return id == null ? null
                : userRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}