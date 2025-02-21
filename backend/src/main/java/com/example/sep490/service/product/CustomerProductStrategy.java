package com.example.sep490.service.product;

import java.util.List;

import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.entity.Product;
import com.example.sep490.strategy.ProductStrategy;

public class CustomerProductStrategy implements ProductStrategy {
    @Override
    public boolean supports(String role) {
        return role.contains("CUSTOMER");
    }
    @Override
    public String processOrder(Long id) {
        return "Customer xử lý đơn hàng " + id;
    }
	@Override
	public List<ProductResponse> getAllProducts() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public ProductResponse getProductById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public Product createProduct(ProductRequest product) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public ProductResponse updateProduct(Long id, ProductRequest productDetails) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public void deleteProduct(Long id) {
		// TODO Auto-generated method stub
		
	}
}
