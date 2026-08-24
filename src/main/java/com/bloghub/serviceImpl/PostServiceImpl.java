package com.bloghub.serviceImpl;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bloghub.configrations.CloudinaryService;
import com.bloghub.domain.UserRole;
import com.bloghub.entity.*;
import com.bloghub.exception.ResourceNotFoundException;
import com.bloghub.mapper.PostMapper;
import com.bloghub.repository.*;
import com.bloghub.request.payload.dto.*;
import com.bloghub.response.payload.dto.PostResponseDTO;
import com.bloghub.service.PostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository     postRepository;
    private final UserRepository     userRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService  cloudinaryService;

    // ── Get JWT logged-in user ──
    private User getLoggedInUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal().equals("anonymousUser"))
            throw new RuntimeException("Unauthorized");
        String email = auth.getName();
        return Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public PostResponseDTO postCreate(PostcreateDTO req, MultipartFile image) {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser.getRole() == UserRole.ADMIN)
            throw new RuntimeException("Admin is not allowed to create post");

        if (req.getAuthorID() == null || !req.getAuthorID().equals(loggedInUser.getId()))
            throw new RuntimeException("Give correct author id");

        Category category = categoryRepository.findById(req.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setCreatedAt(LocalDateTime.now());
        post.setAuthor(loggedInUser);
        post.setCategory(category);

        // Upload image to Cloudinary
        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(image);
                post.setImageUrl(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Image upload failed: " + e.getMessage());
            }
        }

        return PostMapper.toDto(postRepository.save(post));
    }

    @Override
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PostResponseDTO> getAllPosts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        Page<Post> postPage  = postRepository.findAll(pageable);
        List<PostResponseDTO> dtoList = postPage.getContent()
                .stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, postPage.getTotalElements());
    }

    @Override
    public PostResponseDTO postgetById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return PostMapper.toDto(post);
    }

    @Override
    public List<PostResponseDTO> searchPosts(String term) {
        List<Post> posts = postRepository
                .findByTitleContainingOrContentContaining(term, term);
        List<PostResponseDTO> responseList = new ArrayList<>();
        for (Post post : posts) responseList.add(PostMapper.toDto(post));
        return responseList;
    }

    @Override
    public List<PostResponseDTO> getPostsByAuthor(Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));
        return postRepository.findByAuthor(author)
                .stream()
                .map(PostMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PostResponseDTO postUpdate(PostUpdateDTO req, Long id) {
        User loggedInUser = getLoggedInUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (!post.getAuthor().getId().equals(loggedInUser.getId()))
            throw new RuntimeException("You can update only your post");
        if (req.getTitle()      != null) post.setTitle(req.getTitle());
        if (req.getContent()    != null) post.setContent(req.getContent());
        if (req.getCategoryID() != null) {
            Category category = categoryRepository.findById(req.getCategoryID())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            post.setCategory(category);
        }
        return PostMapper.toDto(postRepository.save(post));
    }

    @Override
    public void postDelete(Long id) {
        User loggedInUser = getLoggedInUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // Delete image from Cloudinary
        if (post.getImageUrl() != null) {
            cloudinaryService.deleteImage(post.getImageUrl());
        }

        if (loggedInUser.getRole() == UserRole.ADMIN) {
            postRepository.delete(post); return;
        }
        if (loggedInUser.getRole() == UserRole.AUTHOR &&
            post.getAuthor().getId().equals(loggedInUser.getId())) {
            postRepository.delete(post); return;
        }
        throw new RuntimeException("You are not allowed to delete this post");
    }
}