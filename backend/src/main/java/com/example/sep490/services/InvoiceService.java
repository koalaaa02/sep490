package com.example.sep490.services;

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
import com.example.sep490.dto.InvoiceRequest;
import com.example.sep490.dto.InvoiceResponse;
import com.example.sep490.mapper.InvoiceMapper;
import com.example.sep490.entities.Invoice;
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
    private UserRepository userRepo;

    public PageResponse<Invoice> getInvoices(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Invoice> invoicePage = invoiceRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(invoicePage);
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
        User user = getUser(invoiceRequest.getAgentId());

        Invoice entity = invoiceMapper.RequestToEntity(invoiceRequest);
        entity.setAgent(user);
        return invoiceMapper.EntityToResponse(invoiceRepo.save(entity));
    }

    public InvoiceResponse updateInvoice(Long id, InvoiceRequest invoiceRequest) {
        Invoice invoice = invoiceRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        User user = getUser(invoiceRequest.getAgentId());

        try {
            objectMapper.updateValue(invoice, invoiceRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        invoice.setAgent(user);
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
    private User getUser(Long id) {
        return id == null ? null
                : userRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}