package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long>{
    List<Supplier> findByIsDeleteFalse();
	Optional<Supplier> findByIdAndIsDeleteFalse(Long id);
}