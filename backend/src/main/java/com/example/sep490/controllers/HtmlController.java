package com.example.sep490.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/html")
public class HtmlController {

    @Value("classpath:templates/example.html")
    private org.springframework.core.io.Resource htmlFile;

    @GetMapping("/read-html-value")
    public String getHtmlContent() throws IOException {
        return new String(htmlFile.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }
}

