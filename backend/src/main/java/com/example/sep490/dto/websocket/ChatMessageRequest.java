package com.example.sep490.dto.websocket;

import com.example.sep490.entity.enums.MessageStatus;
import com.example.sep490.entity.enums.MessageType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class ChatMessageRequest {
    private Long id;

    private String content;
    private LocalDateTime timestamp = LocalDateTime.now();
    private MessageType messageType = MessageType.TEXT; // TEXT, IMAGE
    private MessageStatus status = MessageStatus.SENT; // SENT, DELIVERED, READ

    // Relationship
    @NotNull(message = "Không tìm thấy chat room.")
    private Long chatRoomId;
    @JsonIgnore
    private Long senderId;
}
