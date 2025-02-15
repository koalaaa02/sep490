package com.example.sep490.services;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.AuthRegisterRequest;
import com.example.sep490.dto.UserRequest;
import com.example.sep490.dto.UserResponse;
import com.example.sep490.entities.User;
import com.example.sep490.entities.Address;
import com.example.sep490.entities.Shop;
import com.example.sep490.entities.User;
import com.example.sep490.entities.enums.UserType;
import com.example.sep490.mapper.UserMapper;
import com.example.sep490.repositories.UserRepository;
import com.example.sep490.repositories.AddressRepository;
import com.example.sep490.repositories.ShopRepository;
import com.example.sep490.repositories.UserRepository;
import com.example.sep490.repositories.specifications.UserFilterDTO;
import com.example.sep490.repositories.specifications.UserSpecification;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.CommonUtils;
import com.example.sep490.utils.MailUtils;
import com.example.sep490.utils.PageResponse;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.MessagingException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

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
    private ObjectMapper objectMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private BasePagination pagination;
    @Autowired
    private MailUtils mailUtils;
    @Autowired
    private CommonUtils commonUtils;

    @Autowired
    private ShopRepository shopRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Value("${spring.mail.username}")
    private String fromEmail;

    public String addUser(AuthRegisterRequest userInfo) {
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        User newUser = User.builder()
		        .name(userInfo.getName())
                .email(userInfo.getEmail())
		        .password(userInfo.getPassword())
                .roles("ROLE_CUSTOMER")
                .isActive(true)
                .userType(UserType.ROLE_CUSTOMER)
		        .build();
        userRepo.save(newUser);
        return "user added to system ";
    }

    public PageResponse<UserResponse> getUsers(UserFilterDTO filter) {
        filter.setCreatedBy(getContextUser().getId());
        Specification<User> spec = UserSpecification.filterUsers(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<User> userPage = userRepo.findAll(spec, pageable);
        Page<UserResponse> userResponsePage = userPage.map(userMapper::EntityToResponse);
        return pagination.createPageResponse(userResponsePage);
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
//        Shop shop = getShop(userRequest.getShopId());

        User entity = userMapper.RequestToEntity(userRequest);
//        entity.setShop(shop);
        return userMapper.EntityToResponse(userRepo.save(entity));
    }

    public UserResponse updateUser(Long id, UserRequest userRequest) {
        User user = userRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));

//        Shop shop = getShop(userRequest.getShopId());

        try {
            objectMapper.updateValue(user, userRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }
//        user.setShop(shop);
        return userMapper.EntityToResponse(userRepo.save(user));
    }

    public void deleteUser(Long id) {
        User updatedUser = userRepo.findByIdAndIsDeleteFalse(id)
                .map(existingUser -> {
                    existingUser.setDelete(true);
                    return userRepo.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với ID: " + id));
    }


    @Transactional
    public String forgotPassword(@RequestBody String email) {
        User user = userRepo.findByEmailAndIsDeleteFalse(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));
        String otp = commonUtils.generateOtp();
        user.setResetToken(otp);
        userRepo.save(user);
        String subject = "Reset Your Password";
        String content = "Xin chào " + user.getName() + ",\n\n"
                + "Đây là mã OTP để đặt lại mật khẩu của bạn: " + otp + "\n\n"
                + "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.";
        try {
            mailUtils.sendPlainTextEmail(fromEmail, user.getEmail(), subject, content);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
        return "Email đặt lại mật khẩu đã được gửi đến địa chỉ " + email;
    }

    @Transactional
    public String changePassword(String email, String oldPassword, String newPassword, String confirmNewPassword) {
        User user = userRepo.findByEmailAndIsDeleteFalse(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác.");
        }
        if(!newPassword.equals(confirmNewPassword)) throw new RuntimeException("Mật khẩu xác nhận không khớp.");
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        return "Mật khẩu đã được thay đổi thành công.";
    }

    @Transactional
    public String changeForgotPassword(String email, String resetToken, String newPassword, String confirmNewPassword) {
        User user = userRepo.findByEmailAndIsDeleteFalse(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));
        if (user.getResetToken() == null || !user.getResetToken().equals(resetToken)) {
            throw new RuntimeException("Mã reset không hợp lệ hoặc đã hết hạn.");
        }
        if(!newPassword.equals(confirmNewPassword)) throw new RuntimeException("Mật khẩu xác nhận không khớp.");
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepo.save(user);

        return "Mật khẩu của bạn đã được cập nhật thành công.";
    }

    private User getUser(Long id) {
        return id == null ? null
                : userRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }
    private Shop getShop(Long id) {
        return id == null ? null
                : shopRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

    public Shop getShopByContextUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            Shop shop = getShop(user.getId());
            return shop;
        }
        return null;
    }

    public User getContextUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            User contextUser = getUser(user.getId());
            if(contextUser == null) throw new RuntimeException("Không tìm thấy thông tin người đăng nhập.");
            return contextUser;
        }else throw new RuntimeException("Không tìm thấy thông tin người đăng nhập.");
    }

}
