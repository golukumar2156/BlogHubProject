package com.bloghub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorResponseDTO {
	
	private Long ID;
    private String name;	
    private String role;	
    private String email;
    private String about;
}
