package com.bloghub.service;

import com.bloghub.exception.NotAllowedhandleException;
import com.bloghub.request.payload.dto.UserLoginRequestDTO;
import com.bloghub.request.payload.dto.UserRegisterRequestDTO;
import com.bloghub.response.payload.dto.AuthResponse;

public interface AuthService {
	
	 AuthResponse register(UserRegisterRequestDTO request)throws NotAllowedhandleException;	
	 AuthResponse login(UserLoginRequestDTO req)throws NotAllowedhandleException;
}
