package com.example.sep490.repositories;

import com.example.sep490.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> , JpaSpecificationExecutor<User> {
    Page<User> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    Page<User> findByIsDeleteFalse(Pageable pageable);
    Optional<User> findByName(String username);
    boolean existsByName(String username);
    Optional<User> findByIdAndIsDeleteFalse(Long id);
    Optional<User> findByEmailAndIsDeleteFalse(String email);

}
