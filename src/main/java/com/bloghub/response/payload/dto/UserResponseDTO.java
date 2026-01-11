package com.bloghub.response.payload.dto;

import java.time.LocalDateTime;

import com.bloghub.domain.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
	    private Long id;
	    private String fullName;
	    private String email;
	    private String phone;
	    private UserRole role;
        private String about;
	    private LocalDateTime createdAt;
	    private LocalDateTime lastLogin;
}
