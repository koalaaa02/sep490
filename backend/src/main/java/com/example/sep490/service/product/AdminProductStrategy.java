package com.example.sep490.service.product;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.entity.Product;
import com.example.sep490.repository.ProductRepository;
import com.example.sep490.strategy.ProductStrategy;

@Service
public class AdminProductStrategy implements ProductStrategy {
	
	@Autowired
	private ProductRepository productRepo;
	
    @Override
    public boolean supports(String role) {
        return role.contains("ROLE_ADMIN");
    }
    
    @Override
    public String processOrder(Long id) {
        return "Admin xử lý đơn hàng " + id;
    }
    
    public List<ProductResponse> getAllProducts() {
        return null;
    }

    public ProductResponse getProductById(Long id) {
        return null;
    }

    public Product createProduct(ProductRequest product) {
        return null;
    }

    public ProductResponse updateProduct(Long id, ProductRequest productDetails) {
//        return productRepo.findById(id)
//                .map(product -> {
//                    product.setName(productDetails.getName());
//                    product.setSpecifications(productDetails.getSpecifications());
//                    product.setDescription(productDetails.getDescription());
//                    return productRepo.save(product);
//                })
//                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    	return null;
    }

    public void deleteProduct(Long id) {
    	productRepo.deleteById(id);
    }
}

