package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long>{
    List<Invoice> findByIsDeleteFalse();
	Optional<Invoice> findByIdAndIsDeleteFalse(Long id);
}