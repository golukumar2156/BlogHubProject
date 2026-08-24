package com.bloghub.request.payload.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequestDTO {
	 private String fullName;

	    @Email(message = "Email should be valid")
	    private String email;
	    
	    @Size(min = 1, message = "About required")
		private String about;

	    private String phone;

}
