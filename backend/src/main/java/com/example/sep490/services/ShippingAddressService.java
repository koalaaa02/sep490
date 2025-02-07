package com.example.sep490.services;

import java.util.Optional;

import com.example.sep490.entities.*;
import com.example.sep490.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.ShippingAddressRequest;
import com.example.sep490.dto.ShippingAddressResponse;
import com.example.sep490.mapper.ShippingAddressMapper;
import com.example.sep490.entities.ShippingAddress;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;

@Service
public class ShippingAddressService {
    @Autowired
    private ShippingAddressRepository shippingAddressRepo;
    @Autowired
    private ShippingAddressMapper shippingAddressMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private UserRepository userRepo;

    public PageResponse<ShippingAddress> getShippingAddresss(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<ShippingAddress> shippingAddressPage = shippingAddressRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(shippingAddressPage);
    }

    public ShippingAddressResponse getShippingAddressById(Long id) {
        Optional<ShippingAddress> ShippingAddress = shippingAddressRepo.findByIdAndIsDeleteFalse(id);
        if (ShippingAddress.isPresent()) {
            return shippingAddressMapper.EntityToResponse(ShippingAddress.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public ShippingAddressResponse createShippingAddress(ShippingAddressRequest shippingAddressRequest) {
        User user = getUser(shippingAddressRequest.getUserId());

        ShippingAddress entity = shippingAddressMapper.RequestToEntity(shippingAddressRequest);
        entity.setUser(user);
        return shippingAddressMapper.EntityToResponse(shippingAddressRepo.save(entity));
    }

    public ShippingAddressResponse updateShippingAddress(Long id, ShippingAddressRequest shippingAddressRequest) {
        ShippingAddress ShippingAddress = shippingAddressRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        User user = getUser(shippingAddressRequest.getUserId());

        ShippingAddress entity = shippingAddressMapper.RequestToEntity(shippingAddressRequest);
        entity.setUser(user);
        ShippingAddress updatedShippingAddress = shippingAddressRepo.save(entity);
        return shippingAddressMapper.EntityToResponse(updatedShippingAddress);

    }

    public void deleteShippingAddress(Long id) {
        ShippingAddress updatedShippingAddress = shippingAddressRepo.findByIdAndIsDeleteFalse(id)
                .map(existingShippingAddress -> {
                    existingShippingAddress.setDelete(true);
                    return shippingAddressRepo.save(existingShippingAddress);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private ShippingAddress getShippingAddress(Long id) {
        return id == null ? null
                : shippingAddressRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private User getUser(Long id) {
        return id == null ? null
                : userRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}