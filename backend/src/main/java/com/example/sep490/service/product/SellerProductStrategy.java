package com.example.sep490.service.product;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entity.Shop;
import com.example.sep490.entity.Supplier;
import com.example.sep490.repository.ShopRepository;
import com.example.sep490.repository.SupplierRepository;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.entity.Category;
import com.example.sep490.entity.Product;
import com.example.sep490.mapper.ProductMapper;
import com.example.sep490.repository.CategoryRepository;
import com.example.sep490.repository.ProductRepository;
import com.example.sep490.strategy.ProductStrategy;
@Service
public class SellerProductStrategy implements ProductStrategy {
	@Autowired
	private ProductRepository productRepo;
	@Autowired
	private CategoryRepository categoryRepo;
	@Autowired
	private ShopRepository shopRepo;
	@Autowired
	private SupplierRepository supplierRepo;
	@Autowired
	private ObjectMapper objectMapper;
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
            List<ProductResponse> proresponse = productMapper.entityToResponses(pros);
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
		Supplier supplier = supplierRepo.findById(productRequest.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Supplier not found"));
		Shop shop = shopRepo.findById(productRequest.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Shop not found"));

        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .specifications(productRequest.getSpecifications())
                .category(category)
				.supplier(supplier)
				.shop(shop)
                .build();
        return productRepo.save(product);
    }

	@Override
	public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
		Category category = categoryRepo.findById(productRequest.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Category not found"));
		Supplier supplier = supplierRepo.findById(productRequest.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Supplier not found"));
		Shop shop = shopRepo.findById(productRequest.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Shop not found"));
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
    		Optional<Product> product = productRepo.findByIdAndCreatedByAndIsDeleteFalse(id, user.getId());
            if(product.isPresent()) {
				Product updateProduct = product.get();
				try {
					objectMapper.updateValue(updateProduct, productRequest);
				} catch (JsonMappingException e) {
					throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
				}
				updateProduct.setCategory(category);
				updateProduct.setSupplier(supplier);
				updateProduct.setShop(shop);
				return productMapper.EntityToResponse(productRepo.save(updateProduct));
			} else {
    	        throw new RuntimeException("Sản phẩm không tồn tại với ID: " + id);
    	    }

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
