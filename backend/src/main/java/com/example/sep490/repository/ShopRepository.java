package com.example.sep490.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.Shop;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    Page<Shop> findByIsDeleteFalse(Pageable pageable);
    Page<Shop> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    Optional<Shop> findByIdAndIsDeleteFalse(Long id);
    Optional<Shop> findByManagerId(Long userId);
}