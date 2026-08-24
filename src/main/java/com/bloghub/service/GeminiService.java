package com.bloghub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String suggestTitles(String content) {
        String prompt = "Based on the following blog content, suggest exactly 5 catchy and engaging blog titles. "
                + "Return ONLY a numbered list like:\n1. Title one\n2. Title two\n\nContent:\n" + content;
        return callGroqSingle(prompt);
    }

    // Next sentence suggestion
    public String suggestNextSentence(String content) {
        String prompt = "You are a blog writing assistant. The user is writing a blog post. "
                + "Based on what they have written so far, continue their blog naturally with ONLY the next 1-2 sentences. "
                + "Match their writing style and tone exactly. "
                + "Do NOT add any explanation, heading, prefix, or extra text. "
                + "Just write the next 1-2 sentences that naturally follow:\n\n"
                + content;
        return callGroqSingle(prompt);
    }

    // NEW — Multi-turn chat with system prompt
    public String chat(String systemPrompt, List<Map<String, String>> messages) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            List<Map<String, Object>> groqMessages = new ArrayList<>();

            // Add system message
            if (systemPrompt != null && !systemPrompt.isBlank()) {
                Map<String, Object> sysMsg = new HashMap<>();
                sysMsg.put("role", "system");
                sysMsg.put("content", systemPrompt);
                groqMessages.add(sysMsg);
            }

            // Add conversation history
            for (Map<String, String> msg : messages) {
                Map<String, Object> m = new HashMap<>();
                m.put("role", msg.getOrDefault("role", "user"));
                m.put("content", msg.getOrDefault("content", ""));
                groqMessages.add(m);
            }

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.3-70b-versatile");
            requestBody.put("messages", groqMessages);
            requestBody.put("max_tokens", 400);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

            List<Map> choices = (List<Map>) response.getBody().get("choices");
            Map firstChoice = choices.get(0);
            Map messageMap = (Map) firstChoice.get("message");
            return (String) messageMap.get("content");

        } catch (Exception e) {
            throw new RuntimeException("AI chat error: " + e.getMessage());
        }
    }

    private String callGroqSingle(String prompt) {
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);
        return chat(null, List.of(userMsg));
    }
}