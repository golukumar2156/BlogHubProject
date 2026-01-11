package com.bloghub.request.payload.dto;

import com.bloghub.domain.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterRequestDTO {

	    @NotBlank(message = "fullName is mandatory")
	    private String fullName;

	    @NotBlank(message = "Email is mandatory")
	    @Email(message = "Email should be valid")
	    private String email;

	    @NotBlank(message = "password is mandatory")
	    @Size(min = 6, message = "Password must contain at least 6 characters")
	    private String password;
	    
	    @NotNull(message = "role is mandatory")
	    private UserRole role;
	    
	    @NotNull(message = "about is mandatory")
	    private String about;
	    
	    private String phone;
	    
	    
}
