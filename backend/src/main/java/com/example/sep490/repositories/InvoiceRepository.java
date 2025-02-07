package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long>{
    Page<Invoice> findByIsDeleteFalse(Pageable pageable);
	Optional<Invoice> findByIdAndIsDeleteFalse(Long id);
}