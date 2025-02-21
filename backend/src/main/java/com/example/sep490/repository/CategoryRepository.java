package com.example.sep490.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.Category;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    Page<Category> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    List<Category> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name);
    Page<Category> findByIsDeleteFalse(Pageable pageable);
    List<Category> findByIsDeleteFalse();
    List<Category> findByIsDeleteFalseAndIsParentTrue();
    List<Category> findByNameContainingIgnoreCaseAndIsDeleteFalseAndIsParentTrue(String name);
    Optional<Category> findByIdAndIsDeleteFalse(Long id);
}
