package com.bloghub.service;

import java.util.List;

import com.bloghub.request.payload.dto.UserUpdateRequestDTO;
import com.bloghub.response.payload.dto.UserResponseDTO;

public interface AuthorService {
     List<UserResponseDTO> getAllauthos();
     UserResponseDTO getAuthorById(Long id);
     UserResponseDTO updateAuthor(Long id,UserUpdateRequestDTO user);
     void deleteAuthor(Long id);
     UserResponseDTO blockUnblockAuthor(Long id);  // ✅ ADD
}
