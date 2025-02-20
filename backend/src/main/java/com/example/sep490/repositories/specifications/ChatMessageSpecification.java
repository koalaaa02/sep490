package com.example.sep490.repositories.specifications;

import com.example.sep490.entities.Address;
import com.example.sep490.entities.ChatMessage;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ChatMessageSpecification {
    public static Specification<ChatMessage> filterChatMessages(ChatMessageFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getChatRoomId() != null) {
                predicates.add(cb.equal(root.get("chatRoom").get("id"), filter.getChatRoomId()));
            }

            predicates.add(cb.equal(root.get("isDelete"),false));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}