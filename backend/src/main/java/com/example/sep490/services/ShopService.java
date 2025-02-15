package com.example.sep490.services;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import com.example.sep490.dto.ProductResponse;
import com.example.sep490.dto.publicdto.ShopResponsePublic;
import com.example.sep490.entities.*;
import com.example.sep490.entities.enums.OrderStatus;
import com.example.sep490.repositories.*;
import com.example.sep490.repositories.specifications.ShopFilterDTO;
import com.example.sep490.repositories.specifications.ShopSpecification;
import com.example.sep490.utils.FileUtils;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
import org.springframework.web.multipart.MultipartFile;

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
    @Autowired
    private UserService userService;
    @Value("${env.backendBaseURL}")
    private String baseURL;

    public PageResponse<ShopResponsePublic> getShopsPublic(int page, int size, String sortBy, String direction, String name) {
        Pageable pageable = pagination.createPageRequest(page, size, sortBy, direction);
        Page<Shop> shopPage =(name == null || name.isBlank())
                ? shopRepo.findByIsDeleteFalse(pageable)
                : shopRepo.findByNameContainingIgnoreCaseAndIsDeleteFalse(name,pageable);
        Page<ShopResponsePublic> shopResponsePage = shopPage.map(shopMapper::EntityToResponsePublic);
        return pagination.createPageResponse(shopResponsePage);
    }

    public PageResponse<ShopResponse> getShops(ShopFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<Shop> spec = ShopSpecification.filterShops(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<Shop> shopPage = shopRepo.findAll(spec, pageable);
        Page<ShopResponse> shopResponsePage = shopPage.map(shopMapper::EntityToResponse);
        return pagination.createPageResponse(shopResponsePage);
    }

    public ShopResponse getShopById(Long id) {
        Optional<Shop> Shop = shopRepo.findByIdAndIsDeleteFalse(id);
        if (Shop.isPresent()) {
            return shopMapper.EntityToResponse(Shop.get());
        } else {
            throw new RuntimeException("Shop không tồn tại với ID: " + id);
        }
    }

    public ShopResponse createShop(ShopRequest shopRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails userInfo = (UserInfoUserDetails) authentication.getPrincipal();
            User user = getUser(userInfo.getId());
            Address address = getAddress(shopRequest.getAddressId());
            if(user.getShop() != null) throw new RuntimeException("Bạn đã có shop " + user.getShop().getName());

            Shop entity = shopMapper.RequestToEntity(shopRequest);
            entity.setManager(user);
            entity.setAddress(address);
            return shopMapper.EntityToResponse(shopRepo.save(entity));
        }else throw new RuntimeException("");

    }

    public ShopResponse updateShop(Long id, ShopRequest shopRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            Shop shop = shopRepo.findByIdAndIsDeleteFalse(id)
                    .orElseThrow(() -> new RuntimeException("Shop không tồn tại với ID: " + id));

            UserInfoUserDetails userInfo = (UserInfoUserDetails) authentication.getPrincipal();
            User user = getUser(userInfo.getId());
            Address address = getAddress(shopRequest.getAddressId());
            try {
                objectMapper.updateValue(address, shopRequest);
            } catch (JsonMappingException e) {
                throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
            }
            shop.setManager(user);
            shop.setAddress(address);
            return shopMapper.EntityToResponse(shopRepo.save(shop));
        }else throw new RuntimeException("");

    }

    public ShopResponse uploadRegistrationCertificate(Long id, MultipartFile image) {
        Shop shop = shopRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại với ID: " + id));
        try {
            String imageURL = FileUtils.uploadFile(image);
            shop.setRegistrationCertificateImages(baseURL + "/" + imageURL);
            return shopMapper.EntityToResponse(shopRepo.save(shop));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public void changeCloseShop(Long id) {
        Shop updatedShop = shopRepo.findByIdAndIsDeleteFalse(id)
                .map(existingShop -> {
                    existingShop.setClose(!existingShop.isClose());
                    return shopRepo.save(existingShop);
                })
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại với ID: " + id));
    }

    public void changeHasPayFee(Long id) {
        Shop updatedShop = shopRepo.findByIdAndIsDeleteFalse(id)
                .map(existingShop -> {
                    existingShop.setActive(true);
                    existingShop.setLastPaymentDate(LocalDateTime.now());
                    existingShop.setTotalFeeDueAmount(BigDecimal.ZERO);
                    return shopRepo.save(existingShop);
                })
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại với ID: " + id));
    }

    public void changeActiveShop(Long id) {
        Shop updatedShop = shopRepo.findByIdAndIsDeleteFalse(id)
                .map(existingShop -> {
                    existingShop.setActive(!existingShop.isActive());
                    return shopRepo.save(existingShop);
                })
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại với ID: " + id));
    }
    
    public void deleteShop(Long id) {
        Shop updatedShop = shopRepo.findByIdAndIsDeleteFalse(id)
                .map(existingShop -> {
                    existingShop.setDelete(true);
                    return shopRepo.save(existingShop);
                })
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại với ID: " + id));
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