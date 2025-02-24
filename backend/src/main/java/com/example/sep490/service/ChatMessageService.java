package com.example.sep490.service;

import com.example.sep490.dto.websocket.ChatMessageRequest;
import com.example.sep490.dto.websocket.ChatMessageResponse;
import com.example.sep490.entity.ChatMessage;
import com.example.sep490.entity.ChatRoom;
import com.example.sep490.entity.User;
import com.example.sep490.entity.enums.MessageStatus;
import com.example.sep490.entity.enums.MessageType;
import com.example.sep490.mapper.ChatMessageMapper;
import com.example.sep490.repository.ChatMessageRepository;
import com.example.sep490.repository.ChatRoomRepository;
import com.example.sep490.repository.UserRepository;
import com.example.sep490.repository.specifications.ChatMessageFilterDTO;
import com.example.sep490.repository.specifications.ChatMessageSpecification;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import org.springframework.data.domain.Pageable;


@Service
public class ChatMessageService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private BasePagination pagination;
    @Autowired
    private ChatMessageMapper chatMessageMapper;


    public ChatMessageResponse sendMessage(ChatMessageRequest chatMessageRequest) {
        Long senderId = chatMessageRequest.getSenderId();
        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageRequest.getChatRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc trò chuyện."));

        if(!(chatRoom.getDealer().getId().equals(senderId) || chatRoom.getShop().getManager().getId().equals(senderId)))
            throw new RuntimeException("Bạn không thuộc cuộc trò chuyện này.");

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // Xác định người nhận dựa vào sender
        User receiver = sender.getId().equals(chatRoom.getDealer().getId())
                ? chatRoom.getShop().getManager()
                : chatRoom.getDealer();
        MessageType messageType = chatMessageRequest.getMessageType();
        String content = chatMessageRequest.getContent();

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .receiver(receiver)
                .messageType(messageType)
                .content(content)
                .timestamp(LocalDateTime.now())
                .status(MessageStatus.SENT).build();
        return chatMessageMapper.EntityToResponse(chatMessageRepository.save(message));
    }

    // list tin nhắn của chat room (cũ nhất -> mới nhất)
    public PageResponse<ChatMessageResponse> getMessagesByChatRoom(ChatMessageFilterDTO filter) {
        User contextUser = userService.getContextUser();
        ChatRoom chatRoom = getChatRoom(filter.getChatRoomId());

        if(!(chatRoom.getDealer().getId().equals(contextUser.getId())
                || chatRoom.getShop().getManager().getId().equals(contextUser.getId()))
        ) throw new RuntimeException("Bạn không thuộc cuộc trò chuyện này.");

        Specification<ChatMessage> spec = ChatMessageSpecification.filterChatMessages(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<ChatMessage> chatMessagePage = chatMessageRepository.findAll(spec, pageable);
        Page<ChatMessageResponse> chatMessageResponsePage = chatMessagePage.map(chatMessageMapper::EntityToResponse);
        return pagination.createPageResponse(chatMessageResponsePage);
    }

    private ChatRoom getChatRoom(Long id) {
        return id == null ? null
                : chatRoomRepository.findByIdAndIsDeleteFalse(id).orElse(null);
    }
}
