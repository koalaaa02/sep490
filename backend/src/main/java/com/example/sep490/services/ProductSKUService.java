package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.entities.*;
import com.example.sep490.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.ProductSKURequest;
import com.example.sep490.dto.ProductSKUResponse;
import com.example.sep490.mapper.ProductSKUMapper;
import com.example.sep490.entities.ProductSKU;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class ProductSKUService {
    @Autowired
    private ProductSKURepository productSKURepo;
    @Autowired
    private ProductSKUMapper productSKUMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private ProductRepository productRepo;

    public PageResponse<ProductSKU> getProductSKUs(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<ProductSKU> productSKUPage = productSKURepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(productSKUPage);
    }

    public ProductSKUResponse getProductSKUById(Long id) {
        Optional<ProductSKU> ProductSKU = productSKURepo.findByIdAndIsDeleteFalse(id);
        if (ProductSKU.isPresent()) {
            return productSKUMapper.EntityToResponse(ProductSKU.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public ProductSKUResponse createProductSKU(ProductSKURequest productSKURequest) {
        Product product = getProduct(productSKURequest.getProductId());

        ProductSKU entity = productSKUMapper.RequestToEntity(productSKURequest);
        entity.setProduct(product);
        return productSKUMapper.EntityToResponse(productSKURepo.save(entity));
    }

    public ProductSKUResponse updateProductSKU(Long id, ProductSKURequest productSKURequest) {
        ProductSKU ProductSKU = productSKURepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        Product product = getProduct(productSKURequest.getProductId());

        ProductSKU entity = productSKUMapper.RequestToEntity(productSKURequest);
        entity.setProduct(product);
        ProductSKU updatedProductSKU = productSKURepo.save(entity);
        return productSKUMapper.EntityToResponse(updatedProductSKU);

    }

    public void deleteProductSKU(Long id) {
        ProductSKU updatedProductSKU = productSKURepo.findByIdAndIsDeleteFalse(id)
                .map(existingProductSKU -> {
                    existingProductSKU.setDelete(true);
                    return productSKURepo.save(existingProductSKU);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private ProductSKU getProductSKU(Long id) {
        return id == null ? null
                : productSKURepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Product getProduct(Long id) {
        return id == null ? null
                : productRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}