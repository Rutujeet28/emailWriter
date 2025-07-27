package com.email.writer.app;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling email generation requests
 * This controller provides HTTP endpoints for the email generation service
 */
@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    // Service dependency for handling email generation logic
    private final EmailGeneratorService emailGeneratorService;

    /**
     * POST endpoint to generate email replies
     * @param emailRequest The request containing email content and tone preferences
     * @return ResponseEntity containing the generated email response
     */
    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {
        // Call the service to generate the email reply
        String response = emailGeneratorService.generateEmailReply(emailRequest);
        // Return the generated email as a successful HTTP response
        return ResponseEntity.ok(response);
    }
}
