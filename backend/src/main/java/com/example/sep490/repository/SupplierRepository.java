package com.example.sep490.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.Supplier;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SupplierRepository extends JpaRepository<Supplier, Long>, JpaSpecificationExecutor<Supplier> {
    Page<Supplier> findByIsDeleteFalse(Pageable pageable);
	Optional<Supplier> findByIdAndIsDeleteFalse(Long id);
}