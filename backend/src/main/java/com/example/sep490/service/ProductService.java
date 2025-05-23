package com.example.sep490.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.sep490.dto.publicdto.ProductResponsePublic;
import com.example.sep490.entity.*;
import com.example.sep490.repository.*;
import com.example.sep490.repository.specifications.ProductFilterDTO;
import com.example.sep490.repository.specifications.ProductSpecification;
import com.example.sep490.utils.FileUtils;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.ProductRequest;
import com.example.sep490.dto.ProductResponse;
import com.example.sep490.mapper.ProductMapper;
import com.example.sep490.entity.Product;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import org.springframework.web.multipart.MultipartFile;

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
	@Autowired
	private UserService userService;
    @Autowired
    private ProductRepository productRepository;
	@Autowired
	private StorageService storageService;
	@Value("${env.backendBaseURL}")
	private String baseURL;

	//	public PageResponse<Product> getProducts(int page, int size, String sortBy, String direction) {
//		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
//		Page<Product> productPage = productRepo.findByIsDeleteFalse(pageable);
//		return pagination.createPageResponse(productPage);
//	}
	public PageResponse<ProductResponsePublic> getProductsPublicByFilter(ProductFilterDTO filter) {
		filter.setStop(false);
		Specification<Product> spec = ProductSpecification.filterProducts(filter);
		Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
		Page<Product> productPage = productRepository.findAll(spec, pageable);
//		Page<ProductResponsePublic> productResponsePage = productPage.map(productMapper::EntityToResponsePublic);
		// Ánh xạ từng sản phẩm và gọi phương thức @AfterMapping
		List<ProductResponsePublic> productResponses = productPage.getContent().stream()
				.map(product -> {
					ProductResponsePublic response = productMapper.EntityToResponsePublic(product);
					productMapper.setPriceRange(response,product ); // Gọi phương thức @AfterMapping
					return response;
				})
				.collect(Collectors.toList());
		Page<ProductResponsePublic> productResponsePage = new PageImpl<>(productResponses, pageable, productPage.getTotalElements());
		return pagination.createPageResponse(productResponsePage);
	}
	public PageResponse<ProductResponse> getProducts(int page, int size, String sortBy, String direction) {
		User contextUser = userService.getContextUser();
		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
		Page<Product> productPage = productRepo.findByCreatedByAndIsDeleteFalse(contextUser.getId(), pageable);
		Page<ProductResponse> productResponsePage = productPage.map(productMapper::EntityToResponse);
		return pagination.createPageResponse(productResponsePage);
	}
	public PageResponse<ProductResponse> getProductsByFilterForAdmin(ProductFilterDTO filter) {
		Specification<Product> spec = ProductSpecification.filterProducts(filter);
		Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
		Page<Product> productPage = productRepository.findAll(spec, pageable);
		Page<ProductResponse> productResponsePage = productPage.map(productMapper::EntityToResponse);
		return pagination.createPageResponse(productResponsePage);
	}
	public PageResponse<ProductResponse> getProductsByFilter(ProductFilterDTO filter) {
		filter.setCreatedBy(userService.getContextUser().getId());
		Specification<Product> spec = ProductSpecification.filterProducts(filter);
		Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
		Page<Product> productPage = productRepository.findAll(spec, pageable);
		Page<ProductResponse> productResponsePage = productPage.map(productMapper::EntityToResponse);
		return pagination.createPageResponse(productResponsePage);
	}
	public ProductResponse getProductById(Long id) {
		Optional<Product> Product = productRepo.findByIdAndIsDeleteFalse(id);
		if (Product.isPresent()) {
			return productMapper.EntityToResponse(Product.get());
		} else {
			throw new RuntimeException("Sản phẩm không tồn tại với ID: " + id);
		}
	}

	public ProductResponse createProduct(ProductRequest productRequest) {
		Shop shop = userService.getShopByContextUser();
		Category category = getCategory(productRequest.getCategoryId());
		Supplier supplier = getSupplier(productRequest.getSupplierId());
		if(category == null) throw new RuntimeException("Bạn chưa chọn danh mục.");
		if(supplier == null) throw new RuntimeException("Bạn chưa chọn nhà cung cấp.");

		Product entity = productMapper.RequestToEntity(productRequest);
		entity.setShop(shop);
		entity.setCategory(category);
		entity.setSupplier(supplier);
		return productMapper.EntityToResponse(productRepo.save(entity));
	}

	public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
		Product product = productRepo.findByIdAndIsDeleteFalse(id)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + id));

		Shop shop = userService.getShopByContextUser();
		Category category = getCategory(productRequest.getCategoryId());
		Supplier supplier = getSupplier(productRequest.getSupplierId());
		if(category == null) throw new RuntimeException("Bạn chưa chọn danh mục.");
		if(supplier == null) throw new RuntimeException("Bạn chưa chọn nhà cung cấp.");

		try {
			objectMapper.updateValue(product, productRequest);
		} catch (JsonMappingException e) {
			throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
		}
		product.setShop(shop);
		product.setCategory(category);
		product.setSupplier(supplier);
		return productMapper.EntityToResponse(productRepo.save(product));
	}

	public ProductResponse uploadImage(Long id, MultipartFile image) {
		Product product = productRepo.findByIdAndIsDeleteFalse(id)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + id));
		try {
			product.setImages("https://mybucketsep490.s3.ap-southeast-2.amazonaws.com/" + storageService.uploadFile(image));
			return productMapper.EntityToResponse(productRepo.save(product));
		} catch (IllegalArgumentException e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	public void deleteProduct(Long id) {
		Product updatedProduct = productRepo.findByIdAndIsDeleteFalse(id)
				.map(existingProduct -> {
					existingProduct.setActive(false);
					return productRepo.save(existingProduct);
				})
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + id));
	}

	public void activateProduct(Long id) {
		Product updatedProduct = productRepo.findByIdAndIsDeleteFalse(id)
				.map(existingProduct -> {
					existingProduct.setActive(!existingProduct.isActive());
					return productRepo.save(existingProduct);
				})
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + id));
	}

	public void stopProduct(Long id) {
		Product updatedProduct = productRepo.findByIdAndIsDeleteFalse(id)
				.map(existingProduct -> {
					existingProduct.setStop(!existingProduct.isStop());
					return productRepo.save(existingProduct);
				})
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + id));
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