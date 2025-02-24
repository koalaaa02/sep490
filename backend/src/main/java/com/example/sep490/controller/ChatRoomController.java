package com.example.sep490.controller;

import com.example.sep490.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/rooms")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER','ROLE_DEALER')")
public class ChatRoomController {
    @Autowired
    private ChatRoomService chatRoomService;

    @PostMapping("/create")
    public ResponseEntity<?> createChatRoom(
            @RequestParam Long dealerId,
            @RequestParam Long shopId) {
        return ResponseEntity.ok(chatRoomService.createOrGetChatRoom(dealerId, shopId));
    }

    @GetMapping("/shop/{shopId}")
    public List<?> getChatRoomsByShop(@PathVariable Long shopId) {
        return chatRoomService.getAllByShopIdOrderByLastMessage(shopId);
    }

    @GetMapping("/buyer/{dealerId}")
    public List<?> getChatRoomsByDealer(@PathVariable Long dealerId) {
        return chatRoomService.getAllByDealerIdOrderByLastMessage(dealerId);
    }
}
