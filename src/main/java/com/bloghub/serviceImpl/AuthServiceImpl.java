package com.bloghub.serviceImpl;

import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bloghub.configrations.JwtProvider;
import com.bloghub.dto.LoginRequest;
import com.bloghub.dto.RegisterRequestDTO;
import com.bloghub.entity.Author;
import com.bloghub.exception.NotAllowedhandleException;
import com.bloghub.exception.ResourceAlreadyExistException;
import com.bloghub.mapper.Authormapper;
import com.bloghub.repository.AuthorRepository;
import com.bloghub.responsepayload.dto.AuthResponse;
import com.bloghub.service.AuthService;

import lombok.AllArgsConstructor;
import lombok.Builder;

@Service
@AllArgsConstructor
@Builder
public class AuthServiceImpl implements AuthService {
	

   
}
