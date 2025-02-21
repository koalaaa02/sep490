package com.example.sep490.controller;

import com.example.sep490.repository.specifications.ProductFilterDTO;
import com.example.sep490.service.CategoryService;
import com.example.sep490.service.ShopService;
import com.example.sep490.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.service.ProductService;
import com.example.sep490.utils.PageResponse;

@RestController
@RequestMapping("/api/public")
public class PublicController {

	@Autowired
	private ProductService productService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ShopService shopService;
    @Autowired
    private UserService userService;
	
	@GetMapping("/products")
    public PageResponse<?> getProducts(@Valid ProductFilterDTO filter) {
        return productService.getProductsPublicByFilter(filter);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(required = false) String name
    ) {
        return ResponseEntity.ok(categoryService.getParentCategories(name));
    }
    @GetMapping("/categories/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("/shops")
    public ResponseEntity<?> getShops(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(required = false) String name
    ) {
        return ResponseEntity.ok(shopService.getShopsPublic(page, size, sortBy, direction, name));
    }
    @GetMapping("/shops/{id}")
    public ResponseEntity<?> getShopById(@PathVariable Long id) {
        return ResponseEntity.ok(shopService.getShopById(id));
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.getUserById(id));
    }
}
