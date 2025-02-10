package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{
    Page<Order> findByIsDeleteFalse(Pageable pageable);
    List<Order> findByCreatedByAndIsDeleteFalse(Long userId);
	Optional<Order> findByIdAndIsDeleteFalse(Long id);

}
