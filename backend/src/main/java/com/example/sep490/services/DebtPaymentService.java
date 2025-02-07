package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.entities.Invoice;
import com.example.sep490.repositories.DebtPaymentRepository;
import com.example.sep490.repositories.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.DebtPaymentRequest;
import com.example.sep490.dto.DebtPaymentResponse;
import com.example.sep490.entities.DebtPayment;
import com.example.sep490.mapper.DebtPaymentMapper;
import com.example.sep490.entities.DebtPayment;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class DebtPaymentService {
    @Autowired
    private DebtPaymentRepository debtPaymentRepo;
    @Autowired
    private DebtPaymentMapper debtPaymentMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private InvoiceRepository invoiceRepo;

    public PageResponse<DebtPayment> getDebtPayments(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<DebtPayment> debtPaymentPage = debtPaymentRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(debtPaymentPage);
    }

    public DebtPaymentResponse getDebtPaymentById(Long id) {
        Optional<DebtPayment> DebtPayment = debtPaymentRepo.findByIdAndIsDeleteFalse(id);
        if (DebtPayment.isPresent()) {
            return debtPaymentMapper.EntityToResponse(DebtPayment.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public DebtPaymentResponse createDebtPayment(DebtPaymentRequest debtPaymentRequest) {
        Invoice invoice = getInvoice(debtPaymentRequest.getInvoiceId());

        DebtPayment entity = debtPaymentMapper.RequestToEntity(debtPaymentRequest);
        entity.setInvoice(invoice);
        return debtPaymentMapper.EntityToResponse(debtPaymentRepo.save(entity));
    }

    public DebtPaymentResponse updateDebtPayment(Long id, DebtPaymentRequest debtPaymentRequest) {
        DebtPayment DebtPayment = debtPaymentRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("DebtPayment not found with id: " + id));

        Invoice invoice = getInvoice(debtPaymentRequest.getInvoiceId());

        DebtPayment entity = debtPaymentMapper.RequestToEntity(debtPaymentRequest);
        entity.setInvoice(invoice);
        DebtPayment updatedDebtPayment = debtPaymentRepo.save(entity);
        return debtPaymentMapper.EntityToResponse(updatedDebtPayment);

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

}