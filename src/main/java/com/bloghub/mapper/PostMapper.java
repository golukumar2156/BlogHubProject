package com.bloghub.mapper;

import com.bloghub.entity.Category;
import com.bloghub.entity.Post;
import com.bloghub.entity.User;
import com.bloghub.response.payload.dto.PostResponseDTO;

import java.time.LocalDateTime;

public class PostMapper {

    // DTO -> Entity
    public static Post toEntity(PostResponseDTO dto, User author, Category category) {

        Post post = new Post();
        post.setID(dto.getID());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setCreatedAt(LocalDateTime.now());

        post.setAuthor(author);      // logged-in author
        post.setCategory(category);  // selected category

        return post;
    }

    // Entity -> DTO
    public static PostResponseDTO toDto(Post post) {

        PostResponseDTO dto = new PostResponseDTO();
        dto.setID(post.getID());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());

        // Author mapping
        dto.setAuthorID(post.getAuthor().getId());
        dto.setAuthorName(post.getAuthor().getFullName());
        // ── NEW ──
        dto.setImageUrl(post.getImageUrl());
        // Category mapping
        dto.setCategoryID(post.getCategory().getID());
        dto.setCategoryName(post.getCategory().getCatName());

        return dto;
    }
}
