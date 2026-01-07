package com.bloghub.service;

import com.bloghub.dto.AuthResponseDTO;
import com.bloghub.dto.LoginRequest;
import com.bloghub.dto.RegisterRequestDTO;
import jakarta.servlet.http.HttpSession;

public interface AuthService {
	
	public AuthResponseDTO register(RegisterRequestDTO request,HttpSession session);	
	public AuthResponseDTO login(LoginRequest request, HttpSession session);
	
}
