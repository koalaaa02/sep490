package com.example.sep490.dto;

import com.example.sep490.entities.Auditable;
import com.example.sep490.entities.ChatRoom;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.User;
import com.example.sep490.entities.enums.MessageStatus;
import com.example.sep490.entities.enums.MessageType;
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
public class ChatRoomResponse {
    private Long id;

    //relationship
    @JsonIgnoreProperties({ "invoices", "addresses", "shop"})
    private User dealer;
    @JsonIgnoreProperties( { "orders","manager","address","products" })
    private Shop shop;


    private boolean isDelete;
    private Long createdBy;
    private Long updatedBy;
    private Long deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
