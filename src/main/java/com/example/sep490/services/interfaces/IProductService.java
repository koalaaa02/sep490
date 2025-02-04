package com.example.sep490.services.interfaces;

import com.example.sep490.entities.Product;
import com.example.sep490.utils.PageResponse;

public interface IProductService {
	public PageResponse<Product> getProducts(int page, int size, String sortBy, String direction);
}
