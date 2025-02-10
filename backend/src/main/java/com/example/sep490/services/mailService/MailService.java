package com.example.sep490.services.mailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Properties;

//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class MailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void sendMail(String toEmail, String subject, String body) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject(subject);
//        message.setText(body);
//
//        mailSender.send(message);
//    }
//
//    public void sendMail(List<String> recipientEmails, String subject, String body) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(recipientEmails.toArray(new String[recipientEmails.size()]));
//        message.setSubject(subject);
//        message.setText(body);
//
//        mailSender.send(message);
//    }
//}
@Service
public class MailService {
    @Autowired
    private JavaMailSender mailSender;


}