package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.ProductSKU;

public interface ProductSKURepository extends JpaRepository<ProductSKU, Long>{
    Page<ProductSKU> findByIsDeleteFalse(Pageable pageable);
	Optional<ProductSKU> findByIdAndIsDeleteFalse(Long id);
}
