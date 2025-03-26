package com.example.sep490.service;

import java.io.IOException;
import java.util.Optional;

import com.example.sep490.entity.*;
import com.example.sep490.repository.*;
import com.example.sep490.utils.FileUtils;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.ProductSKURequest;
import com.example.sep490.dto.ProductSKUResponse;
import com.example.sep490.mapper.ProductSKUMapper;
import com.example.sep490.entity.ProductSKU;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductSKUService {
    @Autowired
    private ProductSKURepository productSKURepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ProductSKUMapper productSKUMapper;
    @Autowired
    private BasePagination pagination;
    @Autowired
    private ProductRepository productRepo;
    @Autowired
    private StorageService storageService;
    @Value("${env.backendBaseURL}")
    private String baseURL;

    public PageResponse<ProductSKUResponse> getProductSKUs(int page, int size, String sortBy, String direction, Long productId) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<ProductSKU> productSKUPage = productSKURepo.findByProductIdAndIsDeleteFalse(productId,pageable);
        Page<ProductSKUResponse> productSKUResponsePage = productSKUPage.map(productSKUMapper::EntityToResponse);
        return pagination.createPageResponse(productSKUResponsePage);
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
        if( product == null) throw new RuntimeException("Phân loại sản phẩm phải thuộc một sản phẩm có sẵn.");
        ProductSKU entity = productSKUMapper.RequestToEntity(productSKURequest);
        entity.setProduct(product);
        return productSKUMapper.EntityToResponse(productSKURepo.save(entity));
    }

    public ProductSKUResponse updateProductSKU(Long id, ProductSKURequest productSKURequest) {
        ProductSKU productSKU = productSKURepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        Product product = getProduct(productSKURequest.getProductId());
        if( product == null) throw new RuntimeException("Phân loại sản phẩm phải thuộc một sản phẩm có sẵn.");

        try {
            objectMapper.updateValue(productSKU, productSKURequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        productSKU.setProduct(product);
        return productSKUMapper.EntityToResponse(productSKURepo.save(productSKU));
    }

    public ProductSKUResponse uploadImage(Long id, MultipartFile image) {
        ProductSKU productSKU = productSKURepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + id));
        try {
//            String imageURL = FileUtils.uploadFile(image);
//            productSKU.setImages(baseURL + "/" + imageURL);
            productSKU.setImages("https://mybucketsep490.s3.ap-southeast-2.amazonaws.com/" + storageService.uploadFile(image));
            return productSKUMapper.EntityToResponse(productSKURepo.save(productSKU));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        }
//        catch (IOException e) {
//            throw new RuntimeException(e.getMessage());
//        }
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