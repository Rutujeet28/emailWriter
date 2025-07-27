package com.email.writer.app;

import lombok.Data;

/**
 * Data Transfer Object (DTO) for email generation requests
 * This class represents the structure of incoming requests for email generation
 */
@Data
public class EmailRequest {
    // The content or context for which an email needs to be generated
    private String emailContent;
    // The desired tone for the email (e.g., formal, casual, professional)
    private String tone;
}
