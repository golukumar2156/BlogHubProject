package com.bloghub.service;

import com.bloghub.dto.LoginRequest;
import com.bloghub.dto.RegisterRequestDTO;
import com.bloghub.exception.NotAllowedhandleException;
import com.bloghub.responsepayload.dto.AuthResponse;

public interface AuthService {
	
	 AuthResponse register(RegisterRequestDTO request)throws NotAllowedhandleException;	
	 AuthResponse login(LoginRequest req)throws NotAllowedhandleException;
}
