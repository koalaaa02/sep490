package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import com.example.sep490.entities.DebtPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.ShippingAddress;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long>{
    Page<ShippingAddress> findByIsDeleteFalse(Pageable pageable);
	Optional<ShippingAddress> findByIdAndIsDeleteFalse(Long id);
}