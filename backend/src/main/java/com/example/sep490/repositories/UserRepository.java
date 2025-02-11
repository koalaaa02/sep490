package com.example.sep490.repositories;

import com.example.sep490.entities.Category;
import com.example.sep490.entities.DebtPayment;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Page<User> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    Page<User> findByIsDeleteFalse(Pageable pageable);
    Optional<User> findByName(String username);
    boolean existsByName(String username);
    Optional<User> findByIdAndIsDeleteFalse(Long id);
    Optional<User> findByEmailAndIsDeleteFalse(String email);

}
