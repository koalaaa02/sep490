package com.example.sep490.repositories;

import com.example.sep490.entities.ChatRoom;
import com.example.sep490.entities.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByIdAndIsDeleteFalse(Long id);

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.dealer.id = :buyerId AND cr.shop.id = :shopId")
    Optional<ChatRoom> findByDealerAndShop(@Param("buyerId") Long buyerId, @Param("shopId") Long shopId);

    @Query(value = """
        SELECT cr.* FROM chat_rooms cr
        LEFT JOIN (SELECT chat_room_id, MAX(timestamp) AS last_msg_time
              FROM chat_messages
              GROUP BY chat_room_id) cm
        ON cr.id = cm.chat_room_id
        WHERE cr.shop_id = :shopId
        ORDER BY cm.last_msg_time DESC
    """, nativeQuery = true)
    List<ChatRoom> findAllByShopIdOrderByLastMessage(@Param("shopId") Long shopId);

    @Query(value = """
        SELECT cr.* FROM chat_rooms cr
        LEFT JOIN (SELECT chat_room_id, MAX(timestamp) AS last_msg_time
              FROM chat_messages
              GROUP BY chat_room_id) cm
        ON cr.id = cm.chat_room_id
        WHERE cr.dealer_id = :dealerId
        ORDER BY cm.last_msg_time DESC
    """, nativeQuery = true)
    List<ChatRoom> findAllByDealerIdOrderByLastMessage(@Param("dealerId") Long dealerId);
}

