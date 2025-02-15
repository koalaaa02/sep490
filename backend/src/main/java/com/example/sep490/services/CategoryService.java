package com.example.sep490.services;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.example.sep490.utils.FileUtils;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.CategoryRequest;
import com.example.sep490.dto.CategoryResponse;
import com.example.sep490.entities.Category;
import com.example.sep490.mapper.CategoryMapper;
import com.example.sep490.entities.Category;
import com.example.sep490.repositories.CategoryRepository;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CategoryService {
	@Autowired
    private CategoryRepository categoryRepo;

	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private CategoryMapper categoryMapper;
	@Autowired
	private BasePagination pagination;
	@Value("${env.backendBaseURL}")
	private String baseURL;
	
//	public PageResponse<Category> getCategories(int page, int size, String sortBy,String direction) {
//		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
//        Page<Category> categoryPage = categoryRepo.findAll(pageable);
//        return pagination.createPageResponse(categoryPage);
//	}

	public PageResponse<CategoryResponse> getCategories(int page, int size, String sortBy, String direction, String nameFilter) {
		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
		Page<Category> categoryPage = (nameFilter == null || nameFilter.isBlank())
				? categoryRepo.findByIsDeleteFalse(pageable)
				: categoryRepo.findByNameContainingIgnoreCaseAndIsDeleteFalse(nameFilter, pageable);
		Page<CategoryResponse> categoryResponsePage = categoryPage.map(categoryMapper::EntityToResponse);
		return pagination.createPageResponse(categoryResponsePage);
	}

	public List<CategoryResponse> getParentCategories(String nameFilter) {
		List<Category> categories = (nameFilter == null || nameFilter.isBlank())
				? categoryRepo.findByIsDeleteFalseAndIsParentTrue()
				: categoryRepo.findByNameContainingIgnoreCaseAndIsDeleteFalseAndIsParentTrue(nameFilter);
		List<CategoryResponse> categoryResponse = categoryMapper.EntitiesToResponses(categories);
		return categoryResponse;
	}

	public CategoryResponse getCategoryById(Long id) {
		Optional<Category> category = categoryRepo.findByIdAndIsDeleteFalse(id);
	    if (category.isPresent()) {
	        return categoryMapper.EntityToResponse(category.get());
	    } else {
	        throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
	    }
	}

	public CategoryResponse createCategory(CategoryRequest categoryRequest) {
		Category parentCategory = getParentCategory(categoryRequest.getParentCategoryId());

		Category entity = categoryMapper.RequestToEntity(categoryRequest);
		entity.setParentCategory(parentCategory);
        return categoryMapper.EntityToResponse(categoryRepo.save(entity));
    }

	public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
		Category category = categoryRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

		Category parentCategory = getParentCategory(categoryRequest.getParentCategoryId());

		try {
			objectMapper.updateValue(category, categoryRequest);
		} catch (JsonMappingException e) {
			throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
		}
		category.setParentCategory(parentCategory);
        return categoryMapper.EntityToResponse(categoryRepo.save(category));
	    
	}

	public CategoryResponse uploadImage(Long id, MultipartFile image) {
		Category category = categoryRepo.findByIdAndIsDeleteFalse(id)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + id));
		try {
			String imageURL = FileUtils.uploadFile(image);
			category.setImages(baseURL + "/" + imageURL);
			return categoryMapper.EntityToResponse(categoryRepo.save(category));
		} catch (IllegalArgumentException e) {
			throw new RuntimeException(e.getMessage());
		} catch (IOException e) {
			throw new RuntimeException(e.getMessage());
		}
	}
	
	public void deleteCategory(Long id) {
	    Category updatedCategory = categoryRepo.findById(id)
	        .map(existingCategory -> { 
	            existingCategory.setDelete(true);
	            return categoryRepo.save(existingCategory);
	        })
	        .orElseThrow(() -> new RuntimeException("Category not found with id " + id));
	}
	private Category getParentCategory(Long parentCategoryId) {
		return parentCategoryId == null ? null
				: categoryRepo.findById(parentCategoryId).orElse(null);
	}

	private static String[] getNullPropertyNames(Object source) {
		return Arrays.stream(source.getClass().getDeclaredFields())
				.filter(field -> {
					try {
						field.setAccessible(true);
						return field.get(source) == null;
					} catch (IllegalAccessException e) {
						return false;
					}
				})
				.map(Field::getName)
				.toArray(String[]::new);
	}
}