package com.example.sep490.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.sep490.entities.Product;
import com.example.sep490.services.ProductService;
import com.example.sep490.utils.PageResponse;

@RestController
@RequestMapping("/api/public")
public class PublicController {

	@Autowired
	private ProductService productService;
	
	@GetMapping("/products")
    public PageResponse<Product> getProducts(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "ASC") String direction
    ) {
        return productService.getProducts(page, size, sortBy, direction);
    }
}
