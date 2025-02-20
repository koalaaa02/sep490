package com.example.sep490.mapper;

import com.example.sep490.dto.websocket.ChatMessageRequest;
import com.example.sep490.dto.websocket.ChatMessageResponse;
import com.example.sep490.entities.ChatMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChatMessageMapper {
    @Mapping(source = "id", target = "id")
    ChatMessageResponse EntityToResponse(ChatMessage chatMessage);
    
    @Mapping(source = "id", target = "id")
    List<ChatMessageResponse> EntitiesToResponses(List<ChatMessage> chatMessage);
    
    @Mapping(source = "id", target = "id")
    ChatMessage RequestToEntity(ChatMessageRequest chatMessageRequest);
    
    @Mapping(source = "id", target = "id")
    List<ChatMessage> RequestsToEntities(List<ChatMessageRequest> chatMessageRequest);
}
