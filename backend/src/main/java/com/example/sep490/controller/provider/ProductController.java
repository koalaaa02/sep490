package com.example.sep490.controller.provider;


import com.example.sep490.dto.ProductRequest;
import com.example.sep490.repository.ProductRepository;
import com.example.sep490.repository.specifications.ProductFilterDTO;
import com.example.sep490.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/provider/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
//    private List<ProductStrategy> strategies;
    private ProductRepository productRepository;

//    @GetMapping({"/admin/","/seller/"})
//    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PROVIDER')")
//    public ResponseEntity<?> getProductsSeller(Authentication authentication) {
//    	String role = authentication.getAuthorities().toString();
//        for (ProductStrategy strategy : strategies) {
//            if (strategy.supports(role)) {
//                return ResponseEntity.ok(strategy.getAllProducts());
//            }
//        }
//        return ResponseEntity.badRequest().body("bad request");
//    }

    @GetMapping({"/"})
    public ResponseEntity<?> getProductsFilter(@Valid ProductFilterDTO filter) {
        return ResponseEntity.ok().body(productService.getProductsByFilter(filter));
    }
    
//    @GetMapping("/{id}")
//    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
//    public ResponseEntity<?> getProductsSellerById(@PathVariable Long id, Authentication authentication) {
//    	String role = authentication.getAuthorities().toString();
//        for (ProductStrategy strategy : strategies) {
//            if (strategy.supports(role)) {
//                return ResponseEntity.ok(strategy.getProductById(id));
//            }
//        }
//        return ResponseEntity.badRequest().body("bad request");
//    }
//    
//    @PostMapping
//    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
//    public ResponseEntity<?> createProduct(@RequestBody ProductRequest product) {
//    	String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
//        for (ProductStrategy strategy : strategies) {
//            if (strategy.supports(role)) {
//                return ResponseEntity.ok(strategy.createProduct(product));
//            }
//        }
//        return ResponseEntity.badRequest().body("Lỗi trong quá trình tạo sản phẩm.");
//    }
    
//    @PutMapping("/{id}")
//    @PreAuthorize("hasAuthority('ROLE_PROVIDER')")
//    public ResponseEntity<?> updateProduct(@PathVariable Long id, ProductRequest productDetails) {
//    	try {
//    		String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
//            for (ProductStrategy strategy : strategies) {
//                if (strategy.supports(role)) {
//                    return ResponseEntity.ok(strategy.updateProduct(id, productDetails));
//                }
//            }
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.badRequest().body("Lỗi trong quá trình sửa sản phẩm.");
//    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductsById(@PathVariable Long id) {
        return ResponseEntity.ok().body(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest product) {
        return ResponseEntity.ok().body(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,@Valid @RequestBody ProductRequest product) {
        if (!id.equals(product.getId())) {
            return ResponseEntity.badRequest().body("id và id của sản phẩm không trùng khớp.");
        }
        return ResponseEntity.ok().body(productService.updateProduct(id, product));
    }

    @PutMapping("/stop/{id}")
    public ResponseEntity<?> stopProduct(@PathVariable Long id) {
        try {
            productService.stopProduct(id);
            return ResponseEntity.ok().body("Cập nhật trạng thái sản phẩm thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình kích hoạt sản phẩm.");
        }
    }

    @PostMapping(value = "/{id}/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadFile(@PathVariable Long id,@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok().body(productService.uploadImage(id, file)) ;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().body("Xóa sản phẩm thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa sản phẩm.");
        }
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
//    	String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
//        for (ProductStrategy strategy : strategies) {
//            if (strategy.supports(role)) {
//            	strategy.deleteProduct(id);
//                return ResponseEntity.ok("Xóa thành công.");
//            }
//        }
////        return ResponseEntity.noContent().build();
//        return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa sản phẩm.");
//    }
}
//
//@GetMapping("/")
//@PreAuthorize("permitAll()") // Cho phép anonymous truy cập
//public ResponseEntity<?> getProducts(Authentication authentication) {
//	String role = authentication.getAuthorities().toString();
//
//    for (ProductStrategy strategy : strategies) {
//        if (strategy.supports(role)) {
//            return ResponseEntity.ok(strategy.processOrder(1535L));
//        }
//    }
//    return ResponseEntity.badRequest().body("abc");
//}