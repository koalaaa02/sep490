package com.example.sep490.service;

import java.util.Objects;
import java.util.Optional;

import com.example.sep490.entity.*;
import com.example.sep490.repository.*;
import com.example.sep490.repository.specifications.AddressFilterDTO;
import com.example.sep490.repository.specifications.AddressSpecification;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;

import com.example.sep490.dto.AddressRequest;
import com.example.sep490.dto.AddressResponse;
import com.example.sep490.mapper.AddressMapper;
import com.example.sep490.entity.Address;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import org.springframework.transaction.annotation.Transactional;
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
    @Autowired
    private UserService userService;

    public PageResponse<AddressResponse> getAddresses(AddressFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<Address> spec = AddressSpecification.filterAddresses(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Address> addressPage = addressRepo.findAll(spec, pageable);
        Page<AddressResponse> addressResponsePage = addressPage.map(addressMapper::EntityToResponse);
        return pagination.createPageResponse(addressResponsePage);
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
        User user = null;
        Shop shop = null;
        if(addressRequest.getUserId() != null && addressRequest.getShopId() == null)
            user = getUser(addressRequest.getUserId());
        else if(addressRequest.getUserId() == null && addressRequest.getShopId() != null)
            shop = getShop(addressRequest.getShopId());
        else throw new RuntimeException("Không xác định được địa chỉ của cá nhân hay shop");

        Address entity = addressMapper.RequestToEntity(addressRequest);
        entity.setUser(user);
        entity.setShop(shop);
        return addressMapper.EntityToResponse(addressRepo.save(entity));
    }

    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest addressRequest) {
        Long checkUserId = userService.getContextUser().getId();
        Address address = addressRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
        if(!Objects.equals(checkUserId, address.getCreatedBy()))
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), "Bạn không có quyền sửa địa chỉ này.");

        User user = null;
        Shop shop = null;
        if(addressRequest.getUserId() != null && addressRequest.getShopId() == null)
            user = getUser(addressRequest.getUserId());
        else if(addressRequest.getUserId() == null && addressRequest.getShopId() != null)
            shop = getShop(addressRequest.getShopId());
        else throw new RuntimeException("Không xác định được địa chỉ của cá nhân hay shop");

        try {
            objectMapper.updateValue(address, addressRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
        address.setUser(user);
        address.setShop(shop);

        if(addressRequest.isDefaultAddress()){
            addressRepo.resetDefaultAddressForUser(userService.getContextUser().getId());
        }
        return addressMapper.EntityToResponse(addressRepo.save(address));
    }

    @Transactional
    public void setDefaultAddress(Long addressId) {
        Long checkUserId = userService.getContextUser().getId();
        addressRepo.resetDefaultAddressForUser(checkUserId);

        Address address = addressRepo.findByIdAndIsDeleteFalse(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ"));

        address.setDefaultAddress(true);
        addressRepo.save(address);
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