package com.example.sep490.repositories.specifications;

import com.example.sep490.entities.Invoice;
import com.example.sep490.entities.Order;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class InvoiceSpecification {
    public static Specification<Invoice> filterInvoices(InvoiceFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getCreatedBy() != null) {
                predicates.add(cb.equal(root.get("createdBy"), filter.getCreatedBy() ));
            }
            if (filter.getAgentId() != null) {
                predicates.add(cb.equal(root.get("agent").get("id"), filter.getAgentId() ));
            }
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getAgentName() != null) {
                predicates.add(cb.like(root.get("agent").get("name"), "%" + filter.getAgentName() + "%"));
            }

            predicates.add(cb.equal(root.get("isDelete"),false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}