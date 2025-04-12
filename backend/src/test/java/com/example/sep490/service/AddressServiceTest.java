//package com.example.sep490.service;
//
//import com.example.sep490.dto.AddressRequest;
//import com.example.sep490.entity.Address;
//import com.example.sep490.entity.Shop;
//import com.example.sep490.entity.User;
//import com.example.sep490.mapper.AddressMapper;
//import com.example.sep490.repository.AddressRepository;
//import com.example.sep490.repository.ShopRepository;
//import com.example.sep490.repository.UserRepository;
//import com.example.sep490.utils.BasePagination;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import com.example.sep490.dto.AddressRequest;
//import com.example.sep490.dto.AddressResponse;
//import com.example.sep490.repository.specifications.AddressFilterDTO;
//import com.example.sep490.utils.BasePagination;
//import com.example.sep490.utils.PageResponse;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.*;
//import org.springframework.data.domain.*;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.Collections;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class AddressServiceTest {
//
//    @InjectMocks
//    private AddressService addressService;
//
//    @Mock
//    private AddressRepository addressRepo;
//    @Mock
//    private ObjectMapper objectMapper;
//    @Mock
//    private AddressMapper addressMapper;
//    @Mock
//    private BasePagination pagination;
//    @Mock
//    private UserRepository userRepo;
//    @Mock
//    private ShopRepository shopRepo;
//    @Mock
//    private UserService userService;
//
//    private User mockUser;
//    private Shop mockShop;
//
//    @BeforeEach
//    void setup() {
//        mockUser = new User();
//        mockUser.setId(1L);
//        mockShop = new Shop();
//        mockShop.setId(2L);
//    }
//
//    @Test
//    void testGetAddressById_Found() {
//        Address address = new Address();
//        address.setId(1L);
//        AddressResponse expectedResponse = new AddressResponse();
//        when(addressRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(address));
//        when(addressMapper.EntityToResponse(address)).thenReturn(expectedResponse);
//
//        AddressResponse response = addressService.getAddressById(1L);
//
//        assertEquals(expectedResponse, response);
//    }
//
//    @Test
//    void testGetAddressById_NotFound() {
//        when(addressRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.empty());
//        RuntimeException ex = assertThrows(RuntimeException.class, () -> addressService.getAddressById(1L));
//        assertEquals("Danh mục không tồn tại với ID: 1", ex.getMessage());
//    }
//
//    @Test
//    void testCreateAddress_ForUser() {
//        AddressRequest request = new AddressRequest();
//        request.setUserId(1L);
//
//        Address address = new Address();
//        AddressResponse response = new AddressResponse();
//
//        when(userRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(mockUser));
//        when(addressMapper.RequestToEntity(request)).thenReturn(address);
//        when(addressRepo.save(address)).thenReturn(address);
//        when(addressMapper.EntityToResponse(address)).thenReturn(response);
//
//        AddressResponse result = addressService.createAddress(request);
//
//        assertEquals(response, result);
//        verify(addressRepo).save(address);
//    }
//
//    @Test
//    void testCreateAddress_InvalidOwner() {
//        AddressRequest request = new AddressRequest();
//        request.setUserId(1L);
//        request.setShopId(2L); // Both set
//
//        RuntimeException ex = assertThrows(RuntimeException.class, () -> addressService.createAddress(request));
//        assertEquals("Không xác định được địa chỉ của cá nhân hay shop", ex.getMessage());
//    }
//
//    @Test
//    void testUpdateAddress_Unauthorized() {
//        AddressRequest request = new AddressRequest();
//        Address address = new Address();
//        address.setCreatedBy(999L);
//
//        when(userService.getContextUser()).thenReturn(mockUser);
//        when(addressRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(address));
//
//        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
//                addressService.updateAddress(1L, request));
//
//        assertTrue(ex.getReason().contains("Bạn không có quyền sửa địa chỉ này."));
//    }
//
//    @Test
//    void testSetDefaultAddress_Success() {
//        Address address = new Address();
//        when(userService.getContextUser()).thenReturn(mockUser);
//        when(addressRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(address));
//
//        addressService.setDefaultAddress(1L);
//
//        assertTrue(address.isDefaultAddress());
//        verify(addressRepo).save(address);
//    }
//
//    @Test
//    void testDeleteAddress_Success() {
//        Address address = new Address();
//        when(addressRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.of(address));
//        when(addressRepo.save(address)).thenReturn(address);
//
//        addressService.deleteAddress(1L);
//
//        verify(addressRepo).save(address);
//        assertTrue(address.isDelete());
//    }
//
//    @Test
//    void testDeleteAddress_NotFound() {
//        when(addressRepo.findByIdAndIsDeleteFalse(1L)).thenReturn(Optional.empty());
//        RuntimeException ex = assertThrows(RuntimeException.class, () -> addressService.deleteAddress(1L));
//        assertEquals("Danh mục không tồn tại với ID: 1", ex.getMessage());
//    }
//}
