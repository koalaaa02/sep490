package com.example.sep490.repository.specifications;

import com.example.sep490.entity.ChatMessage;
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