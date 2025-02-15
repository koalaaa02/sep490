package com.example.sep490.repositories.specifications;

import com.example.sep490.entities.Product;
import com.example.sep490.entities.ProductSKU;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {
    public static Specification<Product> filterProducts(ProductFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getName() != null) {
                predicates.add(cb.like(root.get("name"), "%" + filter.getName() + "%"));
            }
            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }
            if (filter.getShopId() != null) {
                predicates.add(cb.equal(root.get("shop").get("id"), filter.getShopId()));
            }
            if (filter.getCreatedBy() != null) {
                predicates.add(cb.equal(root.get("createdBy"), filter.getCreatedBy()));
            }
            Join<Product, ProductSKU> skuJoin = root.join("skus", JoinType.INNER);

            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(skuJoin.get("sellingPrice"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(skuJoin.get("sellingPrice"), filter.getMaxPrice()));
            }

            predicates.add(cb.equal(root.get("isDelete"), false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
