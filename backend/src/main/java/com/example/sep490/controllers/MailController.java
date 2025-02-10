package com.example.sep490.controllers;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
@RequestMapping("/api/mail")
public class MailController {
    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/send_text_email")
    public String sendPlainTextEmail(Model model) {
        String from = "vuvthe163299@fpt.edu.vn";
        String to = "vuvu15202@gmail.com";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("This is a plain text email");
        message.setText("Hello guys! This is a plain text email.");

        mailSender.send(message);

        model.addAttribute("message", "A plain text email has been sent");
        return "result";
    }

    @GetMapping("/send_html_email")
    public String sendHTMLEmail(Model model) throws MessagingException {
        String from = "vuvthe163299@fpt.edu.vn";
        String to = "vuvu15202@gmail.com";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setSubject("This is an HTML email");
        helper.setFrom(from);
        helper.setTo(to);

        boolean html = true;
        helper.setText("<b>Hey guys</b>,<br><i>Welcome to my new home</i>", html);

        mailSender.send(message);

        model.addAttribute("message", "An HTML email has been sent");
        return "result";
    }

    @GetMapping("/send_email_attachment")
    public String sendHTMLEmailWithAttachment(Model model) throws MessagingException {

        String from = "vuvthe163299@fpt.edu.vn";
        String to = "vuvu15202@gmail.com";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setSubject("Here's your e-book");
        helper.setFrom(from);
        helper.setTo(to);

        helper.setText("<b>Dear friend</b>,<br><i>Please find the book attached.</i>", true);

        FileSystemResource file = new FileSystemResource(new File("C:\\Users\\Admin\\Downloads\\IMG_6590.JPG"));
        helper.addAttachment("FreelanceSuccess.pdf", file);

        mailSender.send(message);

        model.addAttribute("message", "An HTML email with attachment has been sent");
        return "result";
    }

    @GetMapping("/send_email_inline_image")
    public String sendHTMLEmailWithInlineImage(Model model) throws MessagingException {

        String from = "vuvthe163299@fpt.edu.vn";
        String to = "vuvu15202@gmail.com";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setSubject("Here's your pic");
        helper.setFrom(from);
        helper.setTo(to);

        String content = "<b>Dear guru</b>,<br><i>Please look at this nice picture:.</i>"
                + "<br><img src='cid:image001'/><br><b>Best Regards</b>";
        helper.setText(content, true);

        FileSystemResource resource = new FileSystemResource(new File("C:\\Users\\Admin\\Downloads\\IMG_6590.JPG"));
        helper.addInline("image001", resource);

        mailSender.send(message);

        model.addAttribute("message", "An HTML email with inline image has been sent");
        return "result";
    }
}
