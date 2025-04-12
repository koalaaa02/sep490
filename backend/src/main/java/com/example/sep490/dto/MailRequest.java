package com.example.sep490.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class MailRequest{
    public String fromEmail;
    public String toEmail;
    public String subject;
    public String content;
}