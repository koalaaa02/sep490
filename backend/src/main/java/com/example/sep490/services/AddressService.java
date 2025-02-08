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
import com.example.sep490.dto.AddressRequest;
import com.example.sep490.dto.AddressResponse;
import com.example.sep490.mapper.AddressMapper;
import com.example.sep490.entities.Address;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private AddressMapper addressMapper;
    @Autowired
    private BasePagination pagination;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ShopRepository shopRepo;

    public PageResponse<Address> getAddresses(int page, int size, String sortBy, String direction) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Address> AddressPage = addressRepo.findByIsDeleteFalse(pageable);
        return pagination.createPageResponse(AddressPage);
    }

    public AddressResponse getAddressById(Long id) {
        Optional<Address> Address = addressRepo.findByIdAndIsDeleteFalse(id);
        if (Address.isPresent()) {
            return addressMapper.EntityToResponse(Address.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    public AddressResponse createAddress(AddressRequest addressRequest) {
        User user = getUser(addressRequest.getUserId());
        Shop shop = getShop(addressRequest.getShopId());

        Address entity = addressMapper.RequestToEntity(addressRequest);
        entity.setUser(user);
        entity.setShop(shop);
        return addressMapper.EntityToResponse(addressRepo.save(entity));
    }

    public AddressResponse updateAddress(Long id, AddressRequest addressRequest) {
        Address address = addressRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

        User user = getUser(addressRequest.getUserId());
        Shop shop = getShop(addressRequest.getShopId());

        try {
            objectMapper.updateValue(address, addressRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        address.setUser(user);
        address.setShop(shop);
        return addressMapper.EntityToResponse(addressRepo.save(address));
    }

    public void deleteAddress(Long id) {
        Address updatedAddress = addressRepo.findByIdAndIsDeleteFalse(id)
                .map(existingAddress -> {
                    existingAddress.setDelete(true);
                    return addressRepo.save(existingAddress);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }

    private Address getAddress(Long id) {
        return id == null ? null
                : addressRepo.findByIdAndIsDeleteFalse(id).orElse(null);
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