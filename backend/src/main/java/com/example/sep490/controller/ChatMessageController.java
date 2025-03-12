package com.example.sep490.controller;

import com.example.sep490.configs.RabbitMQConfig;
import com.example.sep490.dto.websocket.ChatMessageRequest;
import com.example.sep490.dto.websocket.ChatMessageResponse;
import com.example.sep490.entity.User;
import com.example.sep490.repository.specifications.ChatMessageFilterDTO;
import com.example.sep490.service.ChatMessageService;
import com.example.sep490.service.UserService;
import com.example.sep490.utils.PageResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER','ROLE_DEALER')")
public class ChatMessageController {

    @Autowired
    private ChatMessageService chatMessageService;
    @Autowired
    private UserService userService;
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private StringRedisTemplate redisTemplate;
    @Autowired
    private String redisChannel;
    private static final Logger logger = LoggerFactory.getLogger(AddressController.class);

    //send message by rabbitmq
    @PostMapping("/api/chat/messages/send")
    public ResponseEntity<?> sendMessage(ChatMessageRequest chatMessageRequest) {
        User user = userService.getContextUser();
        if(user == null) throw new RuntimeException("Không tìm thấy thông tin người gửi.");
        chatMessageRequest.setSenderId(user.getId());
        //save db
        ChatMessageResponse chatMessageResponse = chatMessageService.sendMessage(chatMessageRequest);
        //send to exchange
        //rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "message.routing.key", chatMessageRequest);
        // redis pub/sub
        try {
            String json = objectMapper.writeValueAsString(chatMessageRequest);
            redisTemplate.convertAndSend(redisChannel, json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(chatMessageRequest);
    }

    @GetMapping("/api/chat/messages/")
    public ResponseEntity<?> getMessages(@Valid ChatMessageFilterDTO filter) {
        PageResponse<ChatMessageResponse> messages = chatMessageService.getMessagesByChatRoom(filter);
        return ResponseEntity.ok(messages);
    }


    //websocket
//    @MessageMapping("/send")
////    @SendTo("/topic/chat/{chatRoomId}")
//    public ChatMessageResponse sendChatMessage(@Payload ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor headerAccessor) {
//        //get username from token
//        String username = (String) headerAccessor.getSessionAttributes().get("username");
//        User user = userService.getUserByUserName(username);
//        if(user == null) throw new RuntimeException("Không tìm thấy thông tin người gửi.");
//
//        chatMessageRequest.setSenderId(user.getId());
//        ChatMessageResponse chatMessageResponse = chatMessageService.sendMessage(chatMessageRequest);
//        messagingTemplate.convertAndSend("/topic/chat/" + chatMessageRequest.getChatRoomId(), chatMessageResponse);
//        logger.info("Fetching addresses with pagination, sort, and filter options.");
//        return chatMessageResponse;
//    }

}

