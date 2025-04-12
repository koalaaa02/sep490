package com.example.sep490.controller.rabbitmq_consumer;

import com.example.sep490.configs.RabbitMQConfig;
import com.example.sep490.dto.MailRequest;
import com.example.sep490.dto.websocket.ChatMessageRequest;
import com.example.sep490.utils.MailUtils;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class MailConsumer {
    @Autowired
    private MailUtils mailUtils;
    @Value("${spring.mail.username}")
    private String fromEmail;

    @RabbitListener(queues = RabbitMQConfig.MAIL_QUEUE)
    public void receiveMessage(MailRequest mailRequest) {
        try {
            mailUtils.sendPlainTextEmail(fromEmail, mailRequest.toEmail, mailRequest.subject, mailRequest.content);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email, hãy kiểm tra lại email: " + e.getMessage());
        }
    }
}

//@Autowired
//private RabbitTemplate rabbitTemplate;
//send to exchange
//rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "message.routing.key", chatMessageRequest);