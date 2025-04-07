package com.example.sep490.repository.specifications;

import com.example.sep490.entity.Order;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class OrderSpecification {
    public static Specification<Order> filterOrders(OrderFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getId() != null) {
                predicates.add(cb.equal(root.get("id"), filter.getId() ));
            }
            if (filter.getOrderCode() != null) {
                predicates.add(cb.equal(root.get("orderCode"), filter.getOrderCode() ));
            }
            if (filter.getShopId() != null) {
                predicates.add(cb.equal(root.get("shop").get("id"), filter.getShopId()));
            }
            if (filter.getDeliveryCode() != null) {
                predicates.add(cb.equal(root.get("deliveryCode"), filter.getDeliveryCode()));
            }
            if (filter.getCreatedBy() != null) {
                predicates.add(cb.equal(root.get("createdBy"), filter.getCreatedBy()));
            }
            if (filter.getDeliveryMethod() != null) {
                predicates.add(cb.equal(root.get("deliveryMethod"), filter.getDeliveryMethod()));
            }
            if (filter.getPaymentMethod() != null) {
                predicates.add(cb.equal(root.get("paymentMethod"), filter.getPaymentMethod()));
            }
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            predicates.add(cb.equal(root.get("paid"),filter.isPaid()));

            predicates.add(cb.equal(root.get("isDelete"),false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}