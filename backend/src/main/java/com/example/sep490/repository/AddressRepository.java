package com.example.sep490.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sep490.entity.Address;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface AddressRepository extends JpaRepository<Address, Long>, JpaSpecificationExecutor<Address> {
    Page<Address> findByIsDeleteFalse(Pageable pageable);
	Optional<Address> findByIdAndIsDeleteFalse(Long id);

    @Transactional
    @Modifying
    @Query(value = "UPDATE tbl_address SET default_address = false WHERE created_by = :createdById", nativeQuery = true)
    void resetDefaultAddressForUser(@Param("createdById") Long createdById);

}