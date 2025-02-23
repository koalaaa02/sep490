package com.example.sep490.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_chat_room")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom extends Auditable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dealer_id")
    private User dealer;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;
}
