package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{
    Page<Transaction> findByIsDeleteFalse(Pageable pageable);
	Optional<Transaction> findByIdAndIsDeleteFalse(Long id);
}