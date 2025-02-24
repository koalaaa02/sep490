package com.example.sep490.repository;

import com.example.sep490.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>, JpaSpecificationExecutor<ChatMessage> {

    // Lấy list tin nhắn theo chatRoom, sắp xếp từ mới nhất -> lâu nhất
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.id = :chatRoomId ORDER BY cm.timestamp DESC")
    List<ChatMessage> findAllByChatRoomIdOrderByOldest(@Param("chatRoomId") Long chatRoomId);
}

