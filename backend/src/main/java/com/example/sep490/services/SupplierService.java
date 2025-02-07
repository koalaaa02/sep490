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
import com.example.sep490.dto.SupplierRequest;
import com.example.sep490.dto.SupplierResponse;
import com.example.sep490.mapper.SupplierMapper;
import com.example.sep490.entities.Supplier;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository supplierRepo;
    @Autowired
    private SupplierMapper supplierMapper;
    @Autowired
    private BasePagination pagination;

    public PageResponse<Supplier> getSuppliers(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Supplier> supplierPage = supplierRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(supplierPage);
    }

    public SupplierResponse getSupplierById(Long id) {
        Optional<Supplier> Supplier = supplierRepo.findByIdAndIsDeleteFalse(id);
        if (Supplier.isPresent()) {
            return supplierMapper.EntityToResponse(Supplier.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public SupplierResponse createSupplier(SupplierRequest supplierRequest) {

        Supplier entity = supplierMapper.RequestToEntity(supplierRequest);
        return supplierMapper.EntityToResponse(supplierRepo.save(entity));
    }

    public SupplierResponse updateSupplier(Long id, SupplierRequest supplierRequest) {
        Supplier Supplier = supplierRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        Supplier entity = supplierMapper.RequestToEntity(supplierRequest);
        Supplier updatedSupplier = supplierRepo.save(entity);
        return supplierMapper.EntityToResponse(updatedSupplier);

    }

    public void deleteSupplier(Long id) {
        Supplier updatedSupplier = supplierRepo.findByIdAndIsDeleteFalse(id)
                .map(existingSupplier -> {
                    existingSupplier.setDelete(true);
                    return supplierRepo.save(existingSupplier);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private Supplier getSupplier(Long id) {
        return id == null ? null
                : supplierRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}