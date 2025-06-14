package com.example.sep490.repository;

import com.example.sep490.dto.UserInvoiceSummary;
import com.example.sep490.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> , JpaSpecificationExecutor<User> {
    Page<User> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    Page<User> findByIsDeleteFalse(Pageable pageable);
    Optional<User> findByName(String username);
    boolean existsByName(String username);
    Optional<User> findByIdAndIsDeleteFalse(Long id);
    Optional<User> findByEmailAndIsDeleteFalse(String email);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByEmailOrNameContainingIgnoreCase(String email, String Name);

    Optional<User> findByEmail(String email);


    //admin statictic
    long count();
    @Query("SELECT r.name, COUNT(u) FROM User u JOIN u.roles r GROUP BY r.name")
    List<Object[]> countUsersByRole();
    @Query("SELECT COUNT(u) FROM User u WHERE MONTH(u.createdAt) = :month AND YEAR(u.createdAt) = :year")
    long countNewUsersInMonth(@Param("month") int month, @Param("year") int year);
}
