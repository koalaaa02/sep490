package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    List<Category> findByIsDeleteFalse();
	Optional<Category> findByIdAndIsDeleteFalse(Long id);
}
