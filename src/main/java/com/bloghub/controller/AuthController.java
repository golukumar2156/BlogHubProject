package com.bloghub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloghub.exception.NotAllowedhandleException;
import com.bloghub.request.payload.dto.UserLoginRequestDTO;
import com.bloghub.request.payload.dto.UserRegisterRequestDTO;
import com.bloghub.response.payload.dto.AuthResponse;
import com.bloghub.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authServiceImpl;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
    		 @Valid @RequestBody UserRegisterRequestDTO request
    ) throws NotAllowedhandleException {

        AuthResponse response = authServiceImpl.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
    		 @Valid  @RequestBody UserLoginRequestDTO request
    ) throws NotAllowedhandleException {

        AuthResponse response = authServiceImpl.login(request);
        return ResponseEntity.ok(response);
    }

}
