package com.example.sep490.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.DebtPayment;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DebtPaymentRepository extends JpaRepository<DebtPayment, Long>, JpaSpecificationExecutor<DebtPayment> {
    Page<DebtPayment> findByIsDeleteFalse(Pageable pageable);
	Optional<DebtPayment> findByIdAndIsDeleteFalse(Long id);
}
