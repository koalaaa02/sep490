package com.example.sep490.dto;


import com.example.sep490.entities.Shop;
import com.example.sep490.entities.User;
import com.example.sep490.entities.enums.MessageStatus;
import com.example.sep490.entities.enums.MessageType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship
    private Long dealerId;
    private Long shopId;
}
