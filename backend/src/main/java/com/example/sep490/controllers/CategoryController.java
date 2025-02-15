package com.example.sep490.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.CategoryRequest;
import com.example.sep490.services.CategoryService;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
//logger.info("Fetching category with id: {}", id);

	@Autowired
	private CategoryService categoryService;
	
	@GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getCategorys(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "ASC") String direction,
        @RequestParam(required = false) String name
    ) {
    	return ResponseEntity.ok(categoryService.getCategories(page, size, sortBy, direction, name));
    }
	
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getCategorysById(@PathVariable Long id) {
    	return ResponseEntity.ok().body(categoryService.getCategoryById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest category) {
    	return ResponseEntity.ok().body(categoryService.createCategory(category));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest category) {
        if (!id.equals(category.getId())) {
            return ResponseEntity.badRequest().body("id và id trong danh mục không trùng khớp.");
        }
        return ResponseEntity.ok().body(categoryService.updateCategory(id, category));
    }

    @PostMapping(value = "/{id}/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadFile(@PathVariable Long id,@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok().body(categoryService.uploadImage(id, file)) ;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
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


//@PutMapping("/{id}")
//@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_SELLER')")
//public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest category) {
//    try {
//        if (!id.equals(category.getId())) {
//            return ResponseEntity.badRequest().body("id và id trong danh mục không trùng khớp.");
//        }
//        return ResponseEntity.ok().body(categoryService.updateCategory(id, category));
//    } catch (RuntimeException e) {
////            return ResponseEntity.notFound().build();
//        return ResponseEntity.badRequest().body(e.getMessage());
//    }
////        return ResponseEntity.badRequest().body("Lỗi trong quá trình sửa danh mục.");
//}