package com.example.sep490.repository.specifications;

import com.example.sep490.entity.Address;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class FilterSpecification {
    public static Specification<Address> filterAddresses(AddressFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("isDelete"),false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}