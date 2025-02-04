package com.example.sep490.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.sep490.entities.Product;
import com.example.sep490.repositories.ProductRepository;
import com.example.sep490.services.interfaces.IProductService;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

import java.util.Optional;

@Service
public class ProductService implements IProductService{
	@Autowired
    private ProductRepository productRepository;

	@Autowired
	private BasePagination pagination;
	
	@Override
	public PageResponse<Product> getProducts(int page, int size, String sortBy,String direction) {
		Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Product> productPage = productRepository.findAll(pageable);
        return pagination.createPageResponse(productPage);
	}


    
}
