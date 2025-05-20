package com.example.sep490.service;

import com.example.sep490.configs.RabbitMQConfig;
import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.*;
import com.example.sep490.entity.Role;
import com.example.sep490.entity.User;
import com.example.sep490.entity.Shop;
import com.example.sep490.entity.enums.UserType;
import com.example.sep490.mapper.UserMapper;
import com.example.sep490.repository.RoleRepository;
import com.example.sep490.repository.UserRepository;
import com.example.sep490.repository.ShopRepository;
import com.example.sep490.repository.specifications.UserFilterDTO;
import com.example.sep490.repository.specifications.UserSpecification;
import com.example.sep490.utils.*;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

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
    private CommonUtils commonUtils;
    @Autowired
    private ShopRepository shopRepo;
    @Autowired
    private RoleRepository roleRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Value("${env.backendBaseURL}")
    private String baseURL;
    @Autowired
    private StorageService storageService;

    public User addUser(AuthRegisterRequest userInfo) {
        String otp = commonUtils.generateOtp();
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        List<Role> roles = List.of(roleRepo.findByName("ROLE_DEALER")
                .orElseThrow(() -> new RuntimeException("Có lỗi xảy ra, không xác định được quyền cho bạn.")));
        User newUser = User.builder()
		        .name(userInfo.getName())
                .lastName("user")
                .firstName(userInfo.getName())
                .email(userInfo.getEmail())
		        .password(userInfo.getPassword())
                .roles(roles)
                .active(false)
                .userType(UserType.ROLE_DEALER)
                .resetToken(otp)
		        .build();
        userRepo.save(newUser);

        String content = "Xin chào " + newUser.getName() + ",\n\n"
                + "Đây là mã OTP để xác minh tài khoản: " + otp + "\n\n"
                + "Xin vui lòng không cung cấp mã OTP cho bất kỳ ai.";
        //send to exchange
        MailRequest mailRequest = MailRequest.builder()
                .fromEmail(null)
                .toEmail(newUser.getEmail())
                .subject("Xác minh tài khoản")
                .content(content).build();
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.MAIL_ROUTING_KEY, mailRequest);
        return newUser;
    }

    @Transactional
    public String activateAccount(String email, String resetToken) {
        User user = userRepo.findByEmailAndIsDeleteFalse(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));
        if (user.getResetToken() == null || !user.getResetToken().equals(resetToken)) {
            throw new RuntimeException("Mã reset không hợp lệ hoặc đã hết hạn.");
        }
        user.setResetToken(null);
        user.setActive(true);
        userRepo.save(user);

        return "Tài khoản xác minh thành công.";
    }

    public PageResponse<UserResponse> getUsers(UserFilterDTO filter) {
//        filter.setCreatedBy(getContextUser().getId());
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
            throw new RuntimeException("Người dùng không tồn tại với ID: " + id);
        }
    }

    public UserResponse getAdminContact() {
        Optional<User> User = userRepo.findByName("admin");
        if (User.isPresent()) {
            User u = User.get();
            u.setCitizenIdentificationCard(null);
            u.setCitizenIdentificationCardImageDown(null);
            u.setCitizenIdentificationCardImageUp(null);
            u.setUserType(null);
            return userMapper.EntityToResponse(u);
        } else {
            throw new RuntimeException("Không tìm thấy admin: ");
        }
    }


    public UserResponse createUser(UserRequest userRequest) {
//        Shop shop = getShop(userRequest.getShopId());

        User entity = userMapper.RequestToEntity(userRequest);
//        entity.setShop(shop);
        return userMapper.EntityToResponse(userRepo.save(entity));
    }

    public UserResponse activeUser(Long id) {
        User user = userRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại với ID: " + id));

        user.setActive(!user.isActive());
        return userMapper.EntityToResponse(userRepo.save(user));
    }
    
    public UserResponse updateUser(Long id, UserRequest userRequest) {
        User user = userRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại với ID: " + id));
//        try {
//            objectMapper.updateValue(user, userRequest);
//        } catch (JsonMappingException e) {
//            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
//        }
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setTIN(userRequest.getTIN());
        user.setCitizenIdentificationCard(userRequest.getCitizenIdentificationCard());
        user.setShopName(userRequest.getShopName());
        return userMapper.EntityToResponse(userRepo.save(user));
    }

    public UserResponse uploadCCCD(MultipartFile image, boolean imageUp) {
        User user = getContextUser();
        try {
            if (imageUp)
                user.setCitizenIdentificationCardImageUp("https://mybucketsep490.s3.ap-southeast-2.amazonaws.com/" + storageService.uploadFile(image));
            else
                user.setCitizenIdentificationCardImageDown("https://mybucketsep490.s3.ap-southeast-2.amazonaws.com/" + storageService.uploadFile(image));

            return userMapper.EntityToResponse(userRepo.save(user));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public void deleteUser(Long id) {
        User updatedUser = userRepo.findByIdAndIsDeleteFalse(id)
                .map(existingUser -> {
                    existingUser.setDelete(true);
                    return userRepo.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại với ID: " + id));
    }


    @Transactional
    public String forgotPassword(@RequestBody String email) {
        User user = userRepo.findByEmailAndIsDeleteFalse(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));
        String otp = commonUtils.generateOtp();
        user.setResetToken(otp);
        userRepo.save(user);

        String content = "Xin chào " + user.getName() + ",\n\n"
                + "Đây là mã OTP để đặt lại mật khẩu của bạn: " + otp + "\n\n"
                + "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.";
        MailRequest mailRequest = MailRequest.builder()
                .fromEmail(null)
                .toEmail(email)
                .subject("Reset Your Password")
                .content(content).build();
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.MAIL_ROUTING_KEY, mailRequest);
        return "Email đặt lại mật khẩu đã được gửi đến địa chỉ " + email +" vui lòng kiểm tra email để lấy thông tin đăng nhập mới.";
    }

    @Transactional
    public String changePassword(String userName, String oldPassword, String newPassword, String confirmNewPassword) {
        User user = userRepo.findByName(userName)
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
    private Shop getShopByManagerId(Long id) {
        return id == null ? null
                : shopRepo.findByManagerId(id).orElse(null);
    }

    public Shop getShopByContextUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            Shop shop = getShopByManagerId(user.getId());
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

    public User getUserByUserName(String username) {
        return userRepo.findByName(username).orElse(null);
    }

    public User getUserByEmailIgnoreCase(String email) {
        return userRepo.findByEmailIgnoreCase(email).orElse(null);
    }

    public User getUserByUserNameOrEmail(String email, String username) {
        return userRepo.findByEmailOrNameContainingIgnoreCase(email, username).orElse(null);
    }

}
