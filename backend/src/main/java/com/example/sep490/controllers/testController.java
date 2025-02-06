package com.example.sep490.controllers;
import com.example.sep490.*;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.sep490.entities.Product;
import com.example.sep490.mapper.ProductMapper;

@RestController
@RequestMapping("")
public class testController {
//	@Autowired
//    private ModelMapper mapper;
//	
//	@Autowired
//    private ProductMapper productMapper;
//	
//	@RequestMapping(value = "/test", method = RequestMethod.GET)
//    public ResponseEntity<?> saveUser() throws Exception {
//		Product product = Product.builder()
//		        .id(1L)
//		        .name("John Doe")
//		        .description("des")
//		        .build();
////		ProductDTO dto = mapper.map(product, ProductDTO.class);
////		ProductDTO dto = ProductMapper.INSTANCE.toDTO(product);
//		ProductDTO dto = productMapper.toDTO(product);
//        return ResponseEntity.ok(dto);
//    }
}