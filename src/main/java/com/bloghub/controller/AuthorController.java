package com.bloghub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloghub.request.payload.dto.UserUpdateRequestDTO;
import com.bloghub.response.payload.dto.UserResponseDTO;
import com.bloghub.service.AuthorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    // GET ALL AUTHORS
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllAuthors() {
        List<UserResponseDTO> authors = authorService.getAllauthos();
        return ResponseEntity.ok(authors);
    }

    //GET AUTHOR BY ID 
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getAuthorById(@PathVariable Long id) {
        UserResponseDTO author = authorService.getAuthorById(id);
        return ResponseEntity.ok(author);
    }

    // UPDATE AUTHOR
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateAuthor(
            @PathVariable Long id,
            @RequestBody UserUpdateRequestDTO user) {

        UserResponseDTO updatedAuthor = authorService.updateAuthor(id, user);
        return ResponseEntity.ok(updatedAuthor);
    }

    //  DELETE AUTHOR
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return new ResponseEntity<>("Author deleted successfully", HttpStatus.OK);
    }
    
    // BLOCK / UNBLOCK
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponseDTO> blockUnblockAuthor(@PathVariable Long id) {

        UserResponseDTO updated = authorService.blockUnblockAuthor(id); // ✅ call service

        return ResponseEntity.ok(updated);
    }
}
