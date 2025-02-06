package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Shop;

public interface ShopRepository extends JpaRepository<Shop, Long>{
    List<Shop> findByIsDeleteFalse();
	Optional<Shop> findByIdAndIsDeleteFalse(Long id);
}