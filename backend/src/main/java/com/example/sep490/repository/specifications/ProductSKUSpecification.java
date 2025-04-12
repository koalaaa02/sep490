package com.example.sep490.repository.specifications;

import com.example.sep490.entity.ProductSKU;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSKUSpecification {
    public static Specification<ProductSKU> filterProductSKUs(ProductSKUFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.getProductId() != null) {
                predicates.add(cb.equal(root.get("product").get("id"), filter.getProductId()));
            }

            predicates.add(cb.equal(root.get("isDelete"), false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
