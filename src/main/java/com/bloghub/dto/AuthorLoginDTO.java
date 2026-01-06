package com.bloghub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorLoginDTO {
    
	    @NotBlank(message = "Email is required")
	    @Email(message = "Email must be in valid format")
	    private String email;

	    @NotBlank(message = "Password is required")
	    @Size(min = 6, message = "Password must contain at least 6 characters")
	    private String password;
}
