package com.bloghub.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
	
	private Long ID;
    private String name;	
    private String role;	
    private String email;
    private String about;
    private LocalDateTime createdAt=LocalDateTime.now();
}
