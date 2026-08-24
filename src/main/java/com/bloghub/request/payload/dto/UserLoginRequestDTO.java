package com.bloghub.request.payload.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginRequestDTO {
	
	@NotBlank(message = "email and passwrod is mandatory")
    private String email;

	@NotBlank(message = "email and passwrod is mandatory")
    private String password;
}
