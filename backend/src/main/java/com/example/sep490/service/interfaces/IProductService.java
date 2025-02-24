package com.example.sep490.service.interfaces;

import com.example.sep490.entity.Product;
import com.example.sep490.utils.PageResponse;

public interface IProductService {
	public PageResponse<Product> getProducts(int page, int size, String sortBy, String direction);
}
