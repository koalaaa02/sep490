package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.DebtPayment;

public interface DebtPaymentRepository extends JpaRepository<DebtPayment, Long>{
    Page<DebtPayment> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    Page<DebtPayment> findByIsDeleteFalse(Pageable pageable);
	Optional<DebtPayment> findByIdAndIsDeleteFalse(Long id);
}
