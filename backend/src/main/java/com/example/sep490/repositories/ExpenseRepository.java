package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long>{
    List<Expense> findByIsDeleteFalse();
	Optional<Expense> findByIdAndIsDeleteFalse(Long id);
}