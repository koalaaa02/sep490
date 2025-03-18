package com.example.sep490.service;

import java.math.BigDecimal;
import java.util.Optional;

import com.example.sep490.entity.*;
import com.example.sep490.entity.enums.InvoiceStatus;
import com.example.sep490.repository.DebtPaymentRepository;
import com.example.sep490.repository.InvoiceRepository;
import com.example.sep490.repository.OrderRepository;
import com.example.sep490.repository.TransactionRepository;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.DebtPaymentRequest;
import com.example.sep490.dto.DebtPaymentResponse;
import com.example.sep490.mapper.DebtPaymentMapper;
import com.example.sep490.entity.DebtPayment;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DebtPaymentService {
    @Autowired
    private DebtPaymentRepository debtPaymentRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DebtPaymentMapper debtPaymentMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private InvoiceRepository invoiceRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private TransactionRepository transactionRepo;

    public PageResponse<DebtPaymentResponse> getDebtPayments(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<DebtPayment> debtPaymentdPage = debtPaymentRepo.findByIsDeleteFalse(pageable);
        Page<DebtPaymentResponse> DebtPaymentdResponsePage = debtPaymentdPage.map(debtPaymentMapper::EntityToResponse);
        return pagination.createPageResponse(DebtPaymentdResponsePage);
    }

    public DebtPaymentResponse getDebtPaymentById(Long id) {
        Optional<DebtPayment> DebtPayment = debtPaymentRepo.findByIdAndIsDeleteFalse(id);
        if (DebtPayment.isPresent()) {
            return debtPaymentMapper.EntityToResponse(DebtPayment.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    @Transactional
    public DebtPaymentResponse createDebtPayment(DebtPaymentRequest debtPaymentRequest) {
        Invoice invoice = getInvoice(debtPaymentRequest.getInvoiceId());
//        Transaction transaction = getTransaction(debtPaymentRequest.getTransactionId());
        if (invoice == null) {
            throw new IllegalArgumentException("Không tìm thấy hóa đơn của khoản trả góp này.");
        }

        DebtPayment entity = debtPaymentMapper.RequestToEntity(debtPaymentRequest);
        entity.setInvoice(invoice);
//        entity.setTransaction(transaction);
        //update entity
        entity = debtPaymentRepo.save(entity);
        //invoice + paidAmount
        invoice.setPaidAmount(invoice.getPaidAmount().add(entity.getAmountPaid()));
        //update status invoice
        if( isGreaterThanOrEqual(invoice.getPaidAmount(),invoice.getTotalAmount()) ){
            invoice.setStatus(InvoiceStatus.PAID);
            Order order = invoice.getOrder();
            order.setPaid(true);
            orderRepo.save(order);
        }else invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
        invoiceRepo.save(invoice);

        return debtPaymentMapper.EntityToResponse(entity);
    }

    @Transactional
    public DebtPaymentResponse updateDebtPayment(Long id, DebtPaymentRequest debtPaymentRequest) {
        DebtPayment debtPayment = debtPaymentRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("DebtPayment not found with id: " + id));

        Invoice invoice = getInvoice(debtPaymentRequest.getInvoiceId());
        if (invoice == null)throw new IllegalArgumentException("Không tìm thấy hóa đơn của khoản trả góp này.");
//        Transaction transaction = getTransaction(debtPaymentRequest.getTransactionId());

        try {
            objectMapper.updateValue(debtPayment, debtPaymentRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        debtPayment.setInvoice(invoice);
//        debtPayment.setTransaction(transaction);
        debtPayment = debtPaymentRepo.save(debtPayment);

        // update amount and status invoice
        BigDecimal totalPaidAmount = invoice.getDebtPayments()
                .stream()
                .map(DebtPayment::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        invoice.setPaidAmount(totalPaidAmount);
        if( isGreaterThanOrEqual(invoice.getPaidAmount(),invoice.getTotalAmount())){
            invoice.setStatus(InvoiceStatus.PAID);
            Order order = invoice.getOrder();
            order.setPaid(true);
            orderRepo.save(order);
        }else invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
        invoiceRepo.save(invoice);

        return debtPaymentMapper.EntityToResponse(debtPayment);
    }

    public void deleteDebtPayment(Long id) {
        DebtPayment updatedDebtPayment = debtPaymentRepo.findByIdAndIsDeleteFalse(id)
                .map(existingDebtPayment -> {
                    existingDebtPayment.setDelete(true);
                    return debtPaymentRepo.save(existingDebtPayment);
                })
                .orElseThrow(() -> new RuntimeException("DebtPayment not found with id " + id));
    }

    private Invoice getInvoice(Long id) {
        return id == null ? null
                : invoiceRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private DebtPayment getDebtPayment(Long id) {
        return id == null ? null
                : debtPaymentRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Transaction getTransaction(Long id) {
        return id == null ? null
                : transactionRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

    public boolean isGreaterThanOrEqual(BigDecimal a, BigDecimal b) {
        if (a == null || b == null) {
            throw new IllegalArgumentException("BigDecimal values cannot be null");
        }
        return a.compareTo(b) >= 0;
    }

}