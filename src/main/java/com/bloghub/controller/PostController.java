package com.bloghub.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.bloghub.request.payload.dto.PostUpdateDTO;
import com.bloghub.request.payload.dto.PostcreateDTO;
import com.bloghub.response.payload.dto.PostResponseDTO;
import com.bloghub.service.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // ── CREATE POST with optional image ──
    // Frontend sends multipart/form-data:
    //   - "post"  → JSON blob  (title, content, authorID, categoryID)
    //   - "image" → image file (optional)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDTO> createPost(
            @RequestPart("post")  @Valid PostcreateDTO req,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        PostResponseDTO response = postService.postCreate(req, image);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ── GET ALL (no pagination) ──
    @GetMapping("/all")
    public ResponseEntity<List<PostResponseDTO>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // ── GET ALL WITH PAGINATION ──
    @GetMapping
    public ResponseEntity<Page<PostResponseDTO>> getAllPosts(
            @RequestParam(defaultValue = "0")          int    page,
            @RequestParam(defaultValue = "5")          int    size,
            @RequestParam(defaultValue = "createdAt")  String sortBy,
            @RequestParam(defaultValue = "desc")       String sortDir) {
        return ResponseEntity.ok(postService.getAllPosts(page, size, sortBy, sortDir));
    }

    // ── GET BY ID ──
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.postgetById(id));
    }

    // ── SEARCH ──
    @GetMapping("/search")
    public ResponseEntity<List<PostResponseDTO>> searchPosts(@RequestParam String term) {
        return ResponseEntity.ok(postService.searchPosts(term));
    }

    // ── GET BY AUTHOR ──
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<PostResponseDTO>> getPostsByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(postService.getPostsByAuthor(authorId));
    }

    // ── UPDATE POST ──
    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDTO> updatePost(
            @PathVariable Long id,
            @RequestBody PostUpdateDTO req) {
        return ResponseEntity.ok(postService.postUpdate(req, id));
    }

    // ── DELETE POST ──
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.postDelete(id);
        return ResponseEntity.ok("Post deleted successfully");
    }
}