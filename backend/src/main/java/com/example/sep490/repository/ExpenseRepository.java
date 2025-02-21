package com.example.sep490.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.Expense;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    Page<Expense> findByIsDeleteFalse(Pageable pageable);
	Optional<Expense> findByIdAndIsDeleteFalse(Long id);
    //cal revenue
    List<Expense> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}