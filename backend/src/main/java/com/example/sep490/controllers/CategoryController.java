package com.example.sep490.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.sep490.dto.CategoryRequest;
import com.example.sep490.services.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;
	
	@GetMapping("/")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getCategorys(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "ASC") String direction
    ) {
    	return ResponseEntity.ok(categoryService.getCategories(page, size, sortBy, direction));
    }
	
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getCategorysById(@PathVariable Long id) {
    	return ResponseEntity.ok().body(categoryService.getCategoryById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest category) {
    	return ResponseEntity.ok().body(categoryService.createCategory(category));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest category) {
    	try {
    		if(id != category.getId()) return ResponseEntity.badRequest().body("id và id trong danh mục không trùng khớp.");
        	return ResponseEntity.ok().body(categoryService.updateCategory(id, category));
        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
        	return ResponseEntity.badRequest().body(e.getMessage());
        }
//        return ResponseEntity.badRequest().body("Lỗi trong quá trình sửa danh mục.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
		try {
        	categoryService.deleteCategory(id);
        	return ResponseEntity.ok().body("Xóa danh mục thành công.");
		} catch (Exception e) {
//	        return ResponseEntity.noContent().build();
	        return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa danh mục.");		
        }
    }
}
