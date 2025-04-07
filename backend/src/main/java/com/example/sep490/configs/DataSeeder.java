package com.example.sep490.configs;

import com.example.sep490.entity.Role;
import com.example.sep490.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedRoles(RoleRepository roleRepository) {
        return args -> {
            List<String> defaultRoles = List.of("ROLE_ADMIN", "ROLE_PROVIDER", "ROLE_DEALER");

            for (String roleName : defaultRoles) {
                roleRepository.findByName(roleName)
                        .orElseGet(() -> roleRepository.save(new Role(null, roleName)));
            }

            System.out.println("Default roles seeded.");
        };
    }
}
