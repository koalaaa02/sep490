package com.example.sep490.repository;

import com.example.sep490.entity.Address;
import com.example.sep490.entity.BankAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long>, JpaSpecificationExecutor<BankAccount> {
    Page<BankAccount> findByIsDeleteFalse(Pageable pageable);
	Optional<BankAccount> findByIdAndIsDeleteFalse(Long id);

    @Transactional
    @Modifying
    @Query(value = "UPDATE tbl_bank_account SET defaultBankAccount = false WHERE created_by = :createdById", nativeQuery = true)
    void resetDefaultBankAccountForUser(@Param("createdById") Long createdById);

}