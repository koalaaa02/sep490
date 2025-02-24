package com.example.sep490.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.sep490.dto.UserRequest;
import com.example.sep490.dto.UserResponse;
import com.example.sep490.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "id", target = "id")
    UserResponse EntityToResponse(User user);
    
    @Mapping(source = "id", target = "id")
    List<UserResponse> entityToResponses(List<User> user);
    
    @Mapping(source = "id", target = "id")
    User RequestToEntity(UserRequest userRequest);
    
    @Mapping(source = "id", target = "id")
    List<User> RequestsToentity(List<UserRequest> userRequest);
}