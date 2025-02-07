package com.example.sep490.services;

import com.example.sep490.dto.UserRequest;
import com.example.sep490.dto.UserResponse;
import com.example.sep490.entities.User;
import com.example.sep490.entities.ShippingAddress;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.User;
import com.example.sep490.mapper.UserMapper;
import com.example.sep490.repositories.UserRepository;
import com.example.sep490.repositories.ShippingAddressRepository;
import com.example.sep490.repositories.ShopRepository;
import com.example.sep490.repositories.UserRepository;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String addUser(User userInfo) {
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        userRepo.save(userInfo);
        return "user added to system ";
    }

    public PageResponse<User> getUsers(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<User> userPage = userRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(userPage);
    }

    public UserResponse getUserById(Long id) {
        Optional<User> User = userRepo.findByIdAndIsDeleteFalse(id);
        if (User.isPresent()) {
            return userMapper.EntityToResponse(User.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public UserResponse createUser(UserRequest userRequest) {
        Shop shop = getShop(userRequest.getShopId());

        User entity = userMapper.RequestToEntity(userRequest);
        entity.setShop(shop);
        return userMapper.EntityToResponse(userRepo.save(entity));
    }

    public UserResponse updateUser(Long id, UserRequest userRequest) {
        User User = userRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        Shop shop = getShop(userRequest.getShopId());

        User entity = userMapper.RequestToEntity(userRequest);
        entity.setShop(shop);
        User updatedUser = userRepo.save(entity);
        return userMapper.EntityToResponse(updatedUser);

    }

    public void deleteUser(Long id) {
        User updatedUser = userRepo.findByIdAndIsDeleteFalse(id)
                .map(existingUser -> {
                    existingUser.setDelete(true);
                    return userRepo.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private User getUser(Long id) {
        return id == null ? null
                : userRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Shop getShop(Long id) {
        return id == null ? null
                : shopRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
}
