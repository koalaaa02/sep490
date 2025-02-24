package com.example.sep490.dto;

import com.example.sep490.entity.Auditable;
import com.example.sep490.entity.ChatRoom;
import com.example.sep490.entity.Shop;
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
