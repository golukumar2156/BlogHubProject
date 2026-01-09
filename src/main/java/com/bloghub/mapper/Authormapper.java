package com.bloghub.mapper;

import com.bloghub.dto.AuthResponseDTO;
import com.bloghub.dto.RegisterRequestDTO;
import com.bloghub.entity.Author;

public class Authormapper {
    
	public static  Author toEntity(RegisterRequestDTO dto) {
		 Author auth=new Author();
		 auth.setName(dto.getName());
		 auth.setEmail(dto.getEmail());
		 auth.setAbout(dto.getAbout());
		 auth.setPassword(dto.getPassword());
		 return auth;
	}
	public static AuthResponseDTO toDTO(Author res) {
		  AuthResponseDTO rdto=new AuthResponseDTO();
		  rdto.setID(res.getId());
		  rdto.setName(res.getName());
		  rdto.setEmail(res.getEmail());
		  rdto.setAbout(res.getAbout());
		  rdto.setRole(res.getRole());
		  return rdto;
	}
	
}
