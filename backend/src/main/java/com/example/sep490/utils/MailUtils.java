package com.example.sep490.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

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