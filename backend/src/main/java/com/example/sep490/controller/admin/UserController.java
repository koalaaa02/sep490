package com.example.sep490.controller.admin;

import com.example.sep490.repository.specifications.UserFilterDTO;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.dto.UserRequest;
import com.example.sep490.service.UserService;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<?> getUsers(@Valid UserFilterDTO filter) {
        return ResponseEntity.ok(userService.getUsers(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @PutMapping("/changeActive/{id}")
    public ResponseEntity<?> activeUser(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.activeUser(id));
    }


//    @PostMapping
//    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequest user) {
//        return ResponseEntity.ok().body(userService.createUser(user));
//    }

//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateUser(@PathVariable Long id,@Valid @RequestBody UserRequest user) {
//        if (!id.equals(user.getId())) {
//            return ResponseEntity.badRequest().body("id và id trong thông tin người dùng không trùng khớp.");
//        }
//        return ResponseEntity.ok().body(userService.updateUser(id, user));
//    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
//        try {
//            userService.deleteUser(id);
//            return ResponseEntity.ok().body("Xóa người dùng thành công.");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Lỗi trong quá trình xóa người dùng.");
//        }
//    }
}