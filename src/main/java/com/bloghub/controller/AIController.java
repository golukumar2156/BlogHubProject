package com.bloghub.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloghub.service.GeminiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;

    // POST /api/ai/suggest-titles
    @PostMapping("/suggest-titles")
    public ResponseEntity<Map<String, String>> suggestTitles(@RequestBody Map<String, String> req) {
        String content = req.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Content field required hai"));
        }
        String titles = geminiService.suggestTitles(content);
        return ResponseEntity.ok(Map.of("titles", titles));
    }

    // POST /api/ai/suggest-content
    @PostMapping("/suggest-content")
    public ResponseEntity<Map<String, String>> suggestContent(@RequestBody Map<String, String> req) {
        String content = req.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Content field required"));
        }
        String suggestion = geminiService.suggestNextSentence(content);
        return ResponseEntity.ok(Map.of("suggestion", suggestion));
    }

    // NEW — POST /api/ai/chat
    // Body: { "systemPrompt": "...", "messages": [{"role":"user","content":"..."}] }
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> req) {
        String systemPrompt = (String) req.get("systemPrompt");
        List<Map<String, String>> messages = (List<Map<String, String>>) req.get("messages");

        if (messages == null || messages.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Messages required"));
        }

        String reply = geminiService.chat(systemPrompt, messages);
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}