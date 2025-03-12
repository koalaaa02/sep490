//package com.example.sep490.controller;
//
//import com.example.sep490.configs.RedisMessagingService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class RedisMessgage {
//    @Autowired
//    private RedisMessagingService redisMessagingService;
//
//    @GetMapping("/redismessage")
//    private String getMessagePage(@RequestParam(required = false) String message) {
//        if (message != null) {
//            redisMessagingService.sendMessage(message);
//        }
//
//        return """
//            <form method="get">
//                <label>Message:</label>
//                <input type="text" name="message"><br><br>
//                <input type="submit">
//            </form>
//        """;
//    }
//}