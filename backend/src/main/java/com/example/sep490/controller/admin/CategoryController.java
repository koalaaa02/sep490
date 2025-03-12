package com.example.sep490.controller.admin;

import com.example.sep490.repository.specifications.CategoryFilterDTO;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.CategoryRequest;
import com.example.sep490.service.CategoryService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/categories")
public class CategoryController {
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
//logger.info("Fetching category with id: {}", id);

	@Autowired
	private CategoryService categoryService;
	
	@GetMapping("/")
    public ResponseEntity<?> getCategories(@Valid CategoryFilterDTO filter) {
    	return ResponseEntity.ok(categoryService.getCategories(filter));
    }
	
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategorysById(@PathVariable Long id) {
    	return ResponseEntity.ok().body(categoryService.getCategoryById(id));
    }
    
    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryRequest category) {
    	return ResponseEntity.ok().body(categoryService.createCategory(category));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,@Valid @RequestBody CategoryRequest category) {
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
//@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER', 'ROLE_PROVIDER')")
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