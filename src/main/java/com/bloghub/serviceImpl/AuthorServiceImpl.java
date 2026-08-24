package com.bloghub.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bloghub.domain.UserRole;
import com.bloghub.entity.User;
import com.bloghub.exception.ResourceNotFoundException;
import com.bloghub.mapper.UserMapper;
import com.bloghub.repository.UserRepository;
import com.bloghub.request.payload.dto.UserUpdateRequestDTO;
import com.bloghub.response.payload.dto.UserResponseDTO;
import com.bloghub.service.AuthorService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final UserRepository userRepository;

    //  Utility get logged-in email from JWT
    private String getLoggedInEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Unauthorized access");
        }
        return auth.getName(); // email from JWT
    }

  
    @Override
    public List<UserResponseDTO> getAllauthos() {

        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.AUTHOR)
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

   
    @Override
    public UserResponseDTO getAuthorById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Author is not found!")
                );
         
        if (user.getRole() == UserRole.ADMIN) {
            throw new ResourceNotFoundException("Author not found!");
        }
        return UserMapper.toDTO(user);
    }

  
    @Override
    public UserResponseDTO updateAuthor(Long id, UserUpdateRequestDTO user) {

        String loggedInEmail = getLoggedInEmail();

        User us = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Author not found!")
                );

        // Authorization: only owner can update
        if (!us.getEmail().equals(loggedInEmail)) {
            throw new RuntimeException("You are not allowed to update this profile");
        }

        // Empty object check
        if (user.getFullName() == null &&
            user.getAbout() == null &&
            user.getEmail() == null) {
            throw new RuntimeException("Empty object not allowed!");
        }

        // Blank validation
        if (user.getFullName() != null && user.getFullName().isBlank()) {
            throw new RuntimeException("Name cannot be blank!");
        }

        if (user.getAbout() != null && user.getAbout().isBlank()) {
            throw new RuntimeException("About cannot be blank!");
        }
        if (user.getPhone() != null && user.getPhone().isBlank()) {
            throw new RuntimeException("phone cannot be blank!");
        }

        //Email uniqueness check
        if (user.getEmail() != null &&
            !user.getEmail().equals(us.getEmail()) &&
            userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Update fields
        if (user.getFullName() != null) {
            us.setFullName(user.getFullName());
        }

        if (user.getAbout() != null) {
            us.setAbout(user.getAbout());
        }

        if (user.getEmail() != null) {
            us.setEmail(user.getEmail());
        }
        if (user.getPhone()!=null) {
		   us.setPhone(user.getPhone());	
		}

        return UserMapper.toDTO(userRepository.save(us));
    }

  
    @Override
    public void deleteAuthor(Long id) {

        String loggedInEmail = getLoggedInEmail();

        User loggedInUser = userRepository.findByEmail(loggedInEmail);

        if (loggedInUser == null) {
            throw new ResourceNotFoundException("User not found");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found!"));

        // Authorization
        if (!loggedInUser.getRole().equals(UserRole.ADMIN) &&
            !user.getEmail().equals(loggedInEmail)) {
            throw new RuntimeException("You are not allowed to delete this account");
        }

        userRepository.delete(user);
    }
    
    // ✅ NEW — Block / Unblock toggle (ADMIN only)
    @Override
    public UserResponseDTO blockUnblockAuthor(Long id) {

        String loggedInEmail = getLoggedInEmail();

        User loggedInUser = userRepository.findByEmail(loggedInEmail);
        if (loggedInUser == null) {
            throw new ResourceNotFoundException("Logged-in user not found");
        }

        // Only ADMIN can block/unblock
        if (!loggedInUser.getRole().equals(UserRole.ADMIN)) {
            throw new RuntimeException("Only admin can block or unblock users");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found!"));

        // Cannot block another ADMIN
        if (user.getRole().equals(UserRole.ADMIN)) {
            throw new RuntimeException("Cannot block an admin account");
        }

        // Toggle verified status
        user.setVerified(!Boolean.TRUE.equals(user.getVerified()));

        return UserMapper.toDTO(userRepository.save(user));
    }
}
