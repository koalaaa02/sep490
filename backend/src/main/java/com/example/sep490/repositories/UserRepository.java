package com.example.sep490.repositories;

import com.example.sep490.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByName(String username);
    boolean existsByName(String username);
}
