package com.example.sep490.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entities.ShippingAddress;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long>{
    List<ShippingAddress> findByIsDeleteFalse();
	Optional<ShippingAddress> findByIdAndIsDeleteFalse(Long id);
}