package com.example.sep490.dto.websocket;

import com.example.sep490.entity.ChatRoom;
import com.example.sep490.entity.User;
import com.example.sep490.entity.enums.MessageStatus;
import com.example.sep490.entity.enums.MessageType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {
    private Long id;

    private MessageType messageType; // TEXT, IMAGE
    private String content;
    private LocalDateTime timestamp;
    private MessageStatus status; // SENT, DELIVERED, READ

    //relationship
    @JsonIgnoreProperties({ "dealer", "shop"})
    private ChatRoom chatRoom;
    @JsonIgnoreProperties({ "invoices", "addresses", "shop"})
    private User sender;
    @JsonIgnoreProperties({ "invoices", "addresses", "shop"})
    private User receiver;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
