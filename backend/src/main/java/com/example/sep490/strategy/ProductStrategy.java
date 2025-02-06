package com.example.sep490.strategy;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.entities.Product;

public interface ProductStrategy {
    boolean supports(String role);
    String processOrder(Long id);
    
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(Long id);
    Product createProduct(ProductRequest product);
    ProductResponse updateProduct(Long id, ProductRequest productDetails);
    void deleteProduct(Long id);
}
