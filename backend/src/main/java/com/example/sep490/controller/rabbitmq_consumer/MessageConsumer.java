package com.example.sep490.controller.rabbitmq_consumer;

import com.example.sep490.configs.RabbitMQConfig;
import com.example.sep490.dto.websocket.ChatMessageRequest;
import com.example.sep490.dto.websocket.ChatMessageResponse;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class MessageConsumer {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Lắng nghe tin nhắn và đẩy qua WebSocket
    @RabbitListener(queues = RabbitMQConfig.MESSAGE_QUEUE)
    public void receiveMessage(ChatMessageResponse chatMessageRequest) {
        messagingTemplate.convertAndSend("/topic/chat/" + chatMessageRequest.getChatRoom().getId(), chatMessageRequest);
    }
}

//@Autowired
//private RabbitTemplate rabbitTemplate;
//send to exchange
//rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "message.routing.key", chatMessageRequest);