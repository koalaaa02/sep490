package com.example.sep490.configs;
import com.example.sep490.dto.websocket.ChatMessageRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisReceiver {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void receiveMessage(String message) {
        try {
            ChatMessageRequest myMessage = objectMapper.readValue(message, ChatMessageRequest.class);
            System.out.println("Got Message: " + myMessage);
            messagingTemplate.convertAndSend("/topic/chat/" + myMessage.getChatRoomId(), myMessage);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

