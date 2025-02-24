package com.example.sep490.utils;

import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class HtmlFileReaderUtils {
    public static String readHtmlFile(String fileName) throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/" + fileName);
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }
}
