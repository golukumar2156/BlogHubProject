package com.bloghub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bloghub.dto.LoginRequest;
import com.bloghub.dto.RegisterRequestDTO;
import com.bloghub.exception.NotAllowedhandleException;
import com.bloghub.responsepayload.dto.AuthResponse;
import com.bloghub.service.AuthService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

}
