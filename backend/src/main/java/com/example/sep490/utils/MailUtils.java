package com.example.sep490.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
@Service
public class MailUtils {

    private final JavaMailSender mailSender;

    public MailUtils(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPlainTextEmail(String from, String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

    public void sendHtmlEmail(String from, String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendEmailWithAttachment(String from, String to, String subject, String htmlContent, String filePath, String attachmentName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        FileSystemResource file = new FileSystemResource(new File(filePath));
        helper.addAttachment(attachmentName, file);

        mailSender.send(message);
    }

    public void sendEmailWithInlineImage(String from, String to, String subject, String htmlContent, String imagePath, String contentId) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        FileSystemResource resource = new FileSystemResource(new File(imagePath));
        helper.addInline(contentId, resource);

        mailSender.send(message);
    }
}


//package com.example.sep490.controllers;
//
//import com.example.sep490.utils.MailUtils;
//import jakarta.mail.MessagingException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/mail")
//public class MailController {
//
//    private final MailUtils mailUtils;
//
//    @Autowired
//    public MailController(MailUtils mailUtils) {
//        this.mailUtils = mailUtils;
//    }
//
//    @GetMapping("/send_text_email")
//    public String sendPlainTextEmail(Model model) {
//        String from = "vuvthe163299@fpt.edu.vn";
//        String to = "vuvu15202@gmail.com";
//        String subject = "This is a plain text email";
//        String text = "Hello guys! This is a plain text email.";
//
//        mailUtils.sendPlainTextEmail(from, to, subject, text);
//
//        model.addAttribute("message", "A plain text email has been sent");
//        return "result";
//    }
//
//    @GetMapping("/send_html_email")
//    public String sendHTMLEmail(Model model) throws MessagingException {
//        String from = "vuvthe163299@fpt.edu.vn";
//        String to = "vuvu15202@gmail.com";
//        String subject = "This is an HTML email";
//        String htmlContent = "<b>Hey guys</b>,<br><i>Welcome to my new home</i>";
//
//        mailUtils.sendHtmlEmail(from, to, subject, htmlContent);
//
//        model.addAttribute("message", "An HTML email has been sent");
//        return "result";
//    }
//
//    @GetMapping("/send_email_attachment")
//    public String sendHTMLEmailWithAttachment(Model model) throws MessagingException {
//        String from = "vuvthe163299@fpt.edu.vn";
//        String to = "vuvu15202@gmail.com";
//        String subject = "Here's your e-book";
//        String htmlContent = "<b>Dear friend</b>,<br><i>Please find the book attached.</i>";
//        String filePath = "C:\\Users\\Admin\\Downloads\\IMG_6590.JPG";
//        String attachmentName = "FreelanceSuccess.pdf";
//
//        mailUtils.sendEmailWithAttachment(from, to, subject, htmlContent, filePath, attachmentName);
//
//        model.addAttribute("message", "An HTML email with attachment has been sent");
//        return "result";
//    }
//
//    @GetMapping("/send_email_inline_image")
//    public String sendHTMLEmailWithInlineImage(Model model) throws MessagingException {
//        String from = "vuvthe163299@fpt.edu.vn";
//        String to = "vuvu15202@gmail.com";
//        String subject = "Here's your pic";
//        String htmlContent = "<b>Dear guru</b>,<br><i>Please look at this nice picture:.</i>"
//                + "<br><img src='cid:image001'/><br><b>Best Regards</b>";
//        String imagePath = "C:\\Users\\Admin\\Downloads\\IMG_6590.JPG";
//        String contentId = "image001";
//
//        mailUtils.sendEmailWithInlineImage(from, to, subject, htmlContent, imagePath, contentId);
//
//        model.addAttribute("message", "An HTML email with inline image has been sent");
//        return "result";
//    }
//}