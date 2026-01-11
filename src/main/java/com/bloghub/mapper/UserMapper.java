package com.bloghub.mapper;

import com.bloghub.entity.User;
import com.bloghub.request.payload.dto.UserRegisterRequestDTO;
import com.bloghub.response.payload.dto.UserResponseDTO;

public class UserMapper {
    
	public static  User toEntity(UserRegisterRequestDTO dto) {
		 User user=new User();
		 user.setFullName(dto.getFullName());
		 user.setEmail(dto.getEmail());
		 user.setPhone(dto.getPhone());
		 user.setPassword(dto.getPassword());
		 user.setRole(dto.getRole());
		 user.setAbout(dto.getAbout());
		 return user;
	}
	public static UserResponseDTO toDTO(User res) {
		  UserResponseDTO dto=new UserResponseDTO();
		  dto.setId(res.getId());
		  dto.setFullName(res.getFullName());
		  dto.setEmail(res.getEmail());
		  dto.setPhone(res.getPhone());
		  dto.setRole(res.getRole());
		  dto.setAbout(res.getAbout());
		  dto.setCreatedAt(res.getCreatedAt());
		  dto.setLastLogin(res.getLastLogin());
		  return dto;
	}
	
}
