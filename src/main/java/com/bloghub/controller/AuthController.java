package com.bloghub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloghub.dto.AuthResponseDTO;
import com.bloghub.dto.LoginRequest;
import com.bloghub.dto.RegisterRequestDTO;
import com.bloghub.serviceImpl.AuthServiceImpl;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthServiceImpl authServiceImpl;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registers(
    		                   @RequestBody RegisterRequestDTO reg ,
    		                    HttpSession session){
    	
    	              AuthResponseDTO response= authServiceImpl.register(reg, session);
    	              return new ResponseEntity<>(response,HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> Login(
    		                  @RequestBody  LoginRequest log,
    		                  HttpSession session){
    	
    	              AuthResponseDTO resposne= authServiceImpl.login(log, session);
    	              return ResponseEntity.ok(resposne);
    }
    
    @GetMapping("/current-user")
    public ResponseEntity<AuthResponseDTO> getUserProfile(HttpSession session){
    	
    	             AuthResponseDTO response= authServiceImpl.getCurrentUser(session);
    	             return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public  ResponseEntity<String> logOut(HttpSession session){
    	   authServiceImpl.Logout(session);
    	   return ResponseEntity.ok("Logout successfully");
    }
}
