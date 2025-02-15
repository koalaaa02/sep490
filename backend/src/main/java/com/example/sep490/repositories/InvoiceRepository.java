package com.example.sep490.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import com.example.sep490.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.Invoice;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InvoiceRepository extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {
    Page<Invoice> findByIsDeleteFalse(Pageable pageable);
	Optional<Invoice> findByIdAndIsDeleteFalse(Long id);
    //cal revenue
    List<Invoice> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}