package com.example.sep490.repository.specifications;

import com.example.sep490.entity.Category;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CategorySpecification {
    public static Specification<Category> filterCategoryes(CategoryFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getName() != null) {
                predicates.add(cb.like(root.get("name"), "%" + filter.getName() + "%" ));
            }

            if (filter.getCreatedBy() != null) {
                predicates.add(cb.equal(root.get("createdBy"), filter.getCreatedBy() ));
            }

            predicates.add(cb.equal(root.get("isDelete"),false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}