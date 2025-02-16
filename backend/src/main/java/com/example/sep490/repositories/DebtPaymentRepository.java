package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.Address;
import com.example.sep490.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.DebtPayment;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DebtPaymentRepository extends JpaRepository<DebtPayment, Long>, JpaSpecificationExecutor<DebtPayment> {
    Page<DebtPayment> findByIsDeleteFalse(Pageable pageable);
	Optional<DebtPayment> findByIdAndIsDeleteFalse(Long id);
}
