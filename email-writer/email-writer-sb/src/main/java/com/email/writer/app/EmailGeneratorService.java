package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Service class responsible for generating email replies using the Gemini AI API
 * This service handles the communication with external AI services and processes responses
 */
@Service
public class EmailGeneratorService {

    // WebClient for making HTTP requests to the Gemini API
    private final WebClient webClient;

    // Gemini API URL configured from application properties
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    // Gemini API key configured from application properties
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    /**
     * Constructor that initializes the WebClient for API communication
     * @param webClientBuilder Spring's WebClient builder for creating HTTP client
     */
    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Main method to generate email replies using the Gemini AI API
     * @param emailRequest The request containing email content and tone preferences
     * @return Generated email reply as a string
     */
    public String generateEmailReply(EmailRequest emailRequest) {
        // Build the prompt for the AI service
        String prompt = buildPrompt(emailRequest);

        // Craft a request payload for the Gemini API
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                       Map.of("parts", new Object[]{
                               Map.of("text", prompt)
                       })
                }
        );

        // Make HTTP POST request to Gemini API and get response
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract and return the generated content from the API response
        return extractResponseContent(response);
    }

    /**
     * Extracts the generated text content from the Gemini API response
     * @param response Raw JSON response from the Gemini API
     * @return Extracted text content or error message if parsing fails
     */
    private String extractResponseContent(String response) {
        try {
            // Parse the JSON response using Jackson ObjectMapper
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            
            // Navigate through the JSON structure to extract the generated text
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            // Return error message if JSON parsing fails
            return "Error processing request: " + e.getMessage();
        }
    }

    /**
     * Builds a prompt for the AI service based on the email request
     * @param emailRequest The request containing email content and tone
     * @return Formatted prompt string for the AI service
     */
    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        // Base instruction for email generation
        prompt.append("Generate a professional email reply for hte following email content. Please don't generate a subject line ");
        
        // Add tone specification if provided
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        
        // Add the original email content to the prompt
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
