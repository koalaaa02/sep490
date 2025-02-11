package com.example.sep490.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long>{
    Page<Expense> findByIsDeleteFalse(Pageable pageable);
	Optional<Expense> findByIdAndIsDeleteFalse(Long id);
    //cal revenue
    List<Expense> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}