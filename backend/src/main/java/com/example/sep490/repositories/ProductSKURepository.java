package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.ProductSKU;

public interface ProductSKURepository extends JpaRepository<ProductSKU, Long>{
    List<ProductSKU> findByIsDeleteFalse();
	Optional<ProductSKU> findByIdAndIsDeleteFalse(Long id);
}
