package com.example.sep490.service;
import java.util.Optional;

import com.example.sep490.repository.*;
import com.example.sep490.repository.specifications.SupplierFilterDTO;
import com.example.sep490.repository.specifications.SupplierSpecification;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.SupplierRequest;
import com.example.sep490.dto.SupplierResponse;
import com.example.sep490.mapper.SupplierMapper;
import com.example.sep490.entity.Supplier;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository supplierRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SupplierMapper supplierMapper;
    @Autowired
    private BasePagination pagination;
    @Autowired
    private UserService userService;

    public PageResponse<SupplierResponse> getSuppliers(SupplierFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<Supplier> spec = SupplierSpecification.filterSuppliers(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Supplier> supplierPage = supplierRepo.findAll(spec, pageable);
        Page<SupplierResponse> supplierResponsePage = supplierPage.map(supplierMapper::EntityToResponse);
        return pagination.createPageResponse(supplierResponsePage);
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
        Supplier supplier = supplierRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        try {
            objectMapper.updateValue(supplier, supplierRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        return supplierMapper.EntityToResponse(supplierRepo.save(supplier));
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