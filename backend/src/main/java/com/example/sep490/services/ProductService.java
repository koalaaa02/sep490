package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.dto.publicdto.ProductResponsePublic;
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
import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.mapper.ProductMapper;
import com.example.sep490.entities.Product;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class ProductService {
	@Autowired
	private ProductRepository productRepo;
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private ProductMapper productMapper;
	@Autowired
	private BasePagination pagination;

	@Autowired
	private CategoryRepository categoryRepo;
	@Autowired
	private SupplierRepository supplierRepo;

//	public PageResponse<Product> getProducts(int page, int size, String sortBy, String direction) {
//		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
//		Page<Product> productPage = productRepo.findByIsDeleteFalse(pageable);
//		return pagination.createPageResponse(productPage);
//	}
	public PageResponse<ProductResponsePublic> getProductsPublic(int page, int size, String sortBy, String direction) {
		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
		Page<Product> productPage = productRepo.findByIsDeleteFalse(pageable);
		Page<ProductResponsePublic> productResponsePage = productPage.map(productMapper::EntityToResponsePublic);
		return pagination.createPageResponse(productResponsePage);
	}
	public PageResponse<ProductResponse> getProducts(int page, int size, String sortBy, String direction) {
		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
		Page<Product> productPage = productRepo.findByIsDeleteFalse(pageable);
		Page<ProductResponse> productResponsePage = productPage.map(productMapper::EntityToResponse);
		return pagination.createPageResponse(productResponsePage);
	}

	public ProductResponse getProductById(Long id) {
		Optional<Product> Product = productRepo.findByIdAndIsDeleteFalse(id);
		if (Product.isPresent()) {
			return productMapper.EntityToResponse(Product.get());
		} else {
			throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
		}
	}

	public ProductResponse createProduct(ProductRequest productRequest) {
		Category category = getCategory(productRequest.getCategoryId());
		Supplier supplier = getSupplier(productRequest.getSupplierId());

		Product entity = productMapper.RequestToEntity(productRequest);
		entity.setCategory(category);
		entity.setSupplier(supplier);
		return productMapper.EntityToResponse(productRepo.save(entity));
	}

	public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
		Product product = productRepo.findByIdAndIsDeleteFalse(id)
				.orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

		Category category = getCategory(productRequest.getCategoryId());
		Supplier supplier = getSupplier(productRequest.getSupplierId());

		try {
			objectMapper.updateValue(product, productRequest);
		} catch (JsonMappingException e) {
			throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
		}
		product.setCategory(category);
		product.setSupplier(supplier);
		return productMapper.EntityToResponse(productRepo.save(product));
	}

	public void deleteProduct(Long id) {
		Product updatedProduct = productRepo.findByIdAndIsDeleteFalse(id)
				.map(existingProduct -> {
					existingProduct.setDelete(true);
					return productRepo.save(existingProduct);
				})
				.orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
	}

	private Product getProduct(Long id) {
		return id == null ? null
				: productRepo.findByIdAndIsDeleteFalse(id).orElse(null);
	}
	private Category getCategory(Long id) {
		return id == null ? null
				: categoryRepo.findByIdAndIsDeleteFalse(id).orElse(null);
	}
	private Supplier getSupplier(Long id) {
		return id == null ? null
				: supplierRepo.findByIdAndIsDeleteFalse(id).orElse(null);
	}

}