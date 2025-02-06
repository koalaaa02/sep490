package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{
    List<Order> findByIsDeleteFalse();
	Optional<Order> findByIdAndIsDeleteFalse(Long id);
}
