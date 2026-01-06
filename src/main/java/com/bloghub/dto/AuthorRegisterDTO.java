package com.bloghub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorRegisterDTO {
	
	@NotBlank(message = "Name should be required")
    private String name;
	
	@NotBlank(message = "Role should be required")
    private String role;
	
	@NotBlank(message = "Email should  be required")
	@Email(message = "Email should be email format")
    private String email;
    private String about;    
}
