package com.bloghub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    
	    @NotBlank(message = "Email is required")
	    @Email(message = "Email must be in valid format")
	    private String email;
        
	    @NotBlank(message = "password is required")
	    private String password;
}
