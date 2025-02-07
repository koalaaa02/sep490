package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    Page<Category> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    Page<Category> findByIsDeleteFalse(Pageable pageable);
	Optional<Category> findByIdAndIsDeleteFalse(Long id);
}
