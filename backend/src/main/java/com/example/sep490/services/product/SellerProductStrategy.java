package com.example.sep490.services.product;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.entities.Category;
import com.example.sep490.entities.Product;
import com.example.sep490.mapper.ProductMapper;
import com.example.sep490.repositories.CategoryRepository;
import com.example.sep490.repositories.ProductRepository;
import com.example.sep490.strategy.ProductStrategy;
@Service
public class SellerProductStrategy implements ProductStrategy {
	@Autowired
	private ProductRepository productRepo;
	@Autowired
	private CategoryRepository categoryRepo;
	@Autowired
    private ProductMapper productMapper;

    @Override
    public boolean supports(String role) {
        return role.contains("ROLE_SELLER");
    }

    @Override
    public String processOrder(Long id) {
        return "Seller xử lý đơn hàng " + id;
    }

	@Override
	public List<ProductResponse> getAllProducts() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            List<Product> pros = productRepo.findByCreatedByAndIsDeleteFalse(user.getId());
            List<ProductResponse> proresponse = productMapper.EntitiesToResponses(pros);
            return proresponse;
        }
        return null;
	}

	@Override
	public ProductResponse getProductById(Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            Optional<Product> product = productRepo.findByIdAndCreatedByAndIsDeleteFalse(id, user.getId());
    	    if (product.isPresent()) {
    	        return productMapper.EntityToResponse(product.get());
    	    } else {
    	        throw new RuntimeException("Sản phẩm không tồn tại với ID: " + id);
    	    }
        }
        throw new RuntimeException("Sản phẩm không tồn tại với ID: " + id);
	}


	@Override
	public Product createProduct(ProductRequest productRequest) {
		Category category = categoryRepo.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .specifications(productRequest.getSpecifications())
                .category(category) 
                .build();
        return productRepo.save(product);
    }

	@Override
	public ProductResponse updateProduct(Long id, ProductRequest productDetails) {
		Category category = categoryRepo.findById(productDetails.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
    		Optional<Product> product = productRepo.findByIdAndCreatedByAndIsDeleteFalse(id, user.getId());
    		Product updateProduct = null;
            if(product.isPresent()) {
            	updateProduct = product.get();  
    	    } else {
    	        throw new RuntimeException("Sản phẩm không tồn tại với ID: " + id);
    	    }
            Product entity = productMapper.RequestToEntity(productDetails);
            entity.setCategory(category);
            return productMapper.EntityToResponse(productRepo.save(entity));
        }
	    
	    return null; 
	}


	@Override
	public void deleteProduct(Long id) {
		
	    Product updatedProduct = productRepo.findById(id)
	        .map(existingProduct -> { 
	            existingProduct.setDelete(false);
	            return productRepo.save(existingProduct);
	        })
	        .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
	}
}
