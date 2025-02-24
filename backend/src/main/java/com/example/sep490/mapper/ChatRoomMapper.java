package com.example.sep490.mapper;

import com.example.sep490.dto.ChatRoomRequest;
import com.example.sep490.dto.ChatRoomResponse;
import com.example.sep490.entity.ChatRoom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChatRoomMapper {
    @Mapping(source = "id", target = "id")
    ChatRoomResponse EntityToResponse(ChatRoom chatRoom);
    
    @Mapping(source = "id", target = "id")
    List<ChatRoomResponse> entityToResponses(List<ChatRoom> chatRoom);
    
    @Mapping(source = "id", target = "id")
    ChatRoom RequestToEntity(ChatRoomRequest chatRoomRequest);
    
    @Mapping(source = "id", target = "id")
    List<ChatRoom> RequestsToentity(List<ChatRoomRequest> chatRoomRequest);
}
