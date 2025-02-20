package com.example.sep490.services;

import com.example.sep490.dto.ChatRoomResponse;
import com.example.sep490.entities.ChatRoom;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.User;
import com.example.sep490.mapper.ChatRoomMapper;
import com.example.sep490.repositories.ChatRoomRepository;
import com.example.sep490.repositories.ShopRepository;
import com.example.sep490.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatRoomService {
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private ChatRoomMapper chatRoomMapper;


    public ChatRoomResponse createOrGetChatRoom(Long buyerId, Long shopId) {
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByDealerAndShop(buyerId, shopId);

        //nếu tồn tại chat room rồi
        if (existingRoom.isPresent()) {
            return chatRoomMapper.EntityToResponse(existingRoom.get());
        }
        // Nếu chưa
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy shop."));
        ChatRoom newRoom = new ChatRoom();
        newRoom.setDealer(buyer);
        newRoom.setShop(shop);
        return chatRoomMapper.EntityToResponse(chatRoomRepository.save(newRoom));
    }

    public List<ChatRoomResponse> getAllByShopIdOrderByLastMessage(Long id) {
        return chatRoomMapper.EntitiesToResponses(chatRoomRepository.findAllByShopIdOrderByLastMessage(id));
    }
    public List<ChatRoomResponse> getAllByDealerIdOrderByLastMessage(Long id) {
        return chatRoomMapper.EntitiesToResponses(chatRoomRepository.findAllByDealerIdOrderByLastMessage(id));
    }
}

