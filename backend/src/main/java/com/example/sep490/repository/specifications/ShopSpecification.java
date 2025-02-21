package com.example.sep490.repository.specifications;

import com.example.sep490.entity.Shop;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ShopSpecification {
    public static Specification<Shop> filterShops(ShopFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getCreatedBy() != null) {
                predicates.add(cb.equal(root.get("createdBy"), filter.getCreatedBy() ));
            }
            predicates.add(cb.equal(root.get("isActive"), filter.isActive() ));
            predicates.add(cb.equal(root.get("isDelete"),false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}