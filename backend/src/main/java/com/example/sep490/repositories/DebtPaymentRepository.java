package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.DebtPayment;

public interface DebtPaymentRepository extends JpaRepository<DebtPayment, Long>{
    List<DebtPayment> findByIsDeleteFalse();
	Optional<DebtPayment> findByIdAndIsDeleteFalse(Long id);
}
