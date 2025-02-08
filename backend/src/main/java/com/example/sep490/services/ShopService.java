package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.entities.*;
import com.example.sep490.repositories.*;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.ShopRequest;
import com.example.sep490.dto.ShopResponse;
import com.example.sep490.mapper.ShopMapper;
import com.example.sep490.entities.Shop;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class ShopService {
    @Autowired
    private ShopRepository shopRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ShopMapper shopMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private AddressRepository addressRepo;

    public PageResponse<Shop> getShops(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Shop> shopPage = shopRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(shopPage);
    }

    public ShopResponse getShopById(Long id) {
        Optional<Shop> Shop = shopRepo.findByIdAndIsDeleteFalse(id);
        if (Shop.isPresent()) {
            return shopMapper.EntityToResponse(Shop.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public ShopResponse createShop(ShopRequest shopRequest) {
        User user = getUser(shopRequest.getManagerId());
        Address address = getAddress(shopRequest.getAddressId());

        Shop entity = shopMapper.RequestToEntity(shopRequest);
        entity.setManager(user);
        entity.setAddress(address);
        return shopMapper.EntityToResponse(shopRepo.save(entity));
    }

    public ShopResponse updateShop(Long id, ShopRequest shopRequest) {
        Shop shop = shopRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        User user = getUser(shopRequest.getManagerId());
        Address address = getAddress(shopRequest.getAddressId());

        try {
            objectMapper.updateValue(address, shopRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        shop.setManager(user);
        shop.setAddress(address);
        return shopMapper.EntityToResponse(shopRepo.save(shop));
    }

    public void deleteShop(Long id) {
        Shop updatedShop = shopRepo.findByIdAndIsDeleteFalse(id)
                .map(existingShop -> {
                    existingShop.setDelete(true);
                    return shopRepo.save(existingShop);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private Shop getShop(Long id) {
        return id == null ? null
                : shopRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private User getUser(Long id) {
        return id == null ? null
                : userRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Address getAddress(Long id) {
        return id == null ? null
                : addressRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}