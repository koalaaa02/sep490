package com.example.sep490.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

@Service
public class CategoryService {
	@Autowired
    private CategoryRepository categoryRepo;
	
	@Autowired
	private CategoryMapper categoryMapper;
	@Autowired
	private BasePagination pagination;
	
//	public PageResponse<Category> getCategories(int page, int size, String sortBy,String direction) {
//		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
//        Page<Category> categoryPage = categoryRepo.findAll(pageable);
//        return pagination.createPageResponse(categoryPage);
//	}

	public PageResponse<Category> getCategories(int page, int size, String sortBy, String direction, String nameFilter) {
		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
		Page<Category> categoryPage = (nameFilter == null || nameFilter.isBlank())
				? categoryRepo.findByIsDeleteFalse(pageable)
				: categoryRepo.findByNameContainingIgnoreCaseAndIsDeleteFalse(nameFilter, pageable);
		return pagination.createPageResponse(categoryPage);
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

		Category entity = categoryMapper.RequestToEntity(categoryRequest);
		entity.setParentCategory(parentCategory);
		Category updatedCat = categoryRepo.save(entity);
        return categoryMapper.EntityToResponse(updatedCat);
	    
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
    
}