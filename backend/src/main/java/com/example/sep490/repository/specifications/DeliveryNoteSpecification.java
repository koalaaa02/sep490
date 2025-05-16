package com.example.sep490.repository.specifications;

import com.example.sep490.entity.DeliveryNote;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class DeliveryNoteSpecification {
    public static Specification<DeliveryNote> filterDeliveryNotes(DeliveryNoteFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getDeliveryCode() != null) {
                predicates.add(cb.equal(root.get("deliveryCode"), filter.getDeliveryCode() ));
            }
            if (filter.getOrderId() != null) {
                predicates.add(cb.equal(root.get("order").get("id"), filter.getOrderId() ));
            }
            if (filter.getCreatedBy() != null) {
                predicates.add(cb.equal(root.get("createdBy"), filter.getCreatedBy() ));
            }
            predicates.add(cb.equal(root.get("isDelete"),false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}