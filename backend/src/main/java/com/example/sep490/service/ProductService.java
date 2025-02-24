package com.example.sep490.service;

import java.io.IOException;
import java.util.Optional;

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
	@Value("${env.backendBaseURL}")
	private String baseURL;

	//	public PageResponse<Product> getProducts(int page, int size, String sortBy, String direction) {
//		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
//		Page<Product> productPage = productRepo.findByIsDeleteFalse(pageable);
//		return pagination.createPageResponse(productPage);
//	}
	public PageResponse<ProductResponsePublic> getProductsPublicByFilter(ProductFilterDTO filter) {
		Specification<Product> spec = ProductSpecification.filterProducts(filter);
		Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
		Page<Product> productPage = productRepository.findAll(spec, pageable);
		Page<ProductResponsePublic> productResponsePage = productPage.map(productMapper::EntityToResponsePublic);
		return pagination.createPageResponse(productResponsePage);
	}
	public PageResponse<ProductResponse> getProducts(int page, int size, String sortBy, String direction) {
		User contextUser = userService.getContextUser();
		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
		Page<Product> productPage = productRepo.findByCreatedByAndIsDeleteFalse(contextUser.getId(), pageable);
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
			String imageURL = FileUtils.uploadFile(image);
			product.setImages(baseURL + "/" + imageURL);
			return productMapper.EntityToResponse(productRepo.save(product));
		} catch (IllegalArgumentException e) {
			throw new RuntimeException(e.getMessage());
		} catch (IOException e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	public void deleteProduct(Long id) {
		Product updatedProduct = productRepo.findByIdAndIsDeleteFalse(id)
				.map(existingProduct -> {
					existingProduct.setDelete(true);
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