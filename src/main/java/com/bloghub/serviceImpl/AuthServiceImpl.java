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
import com.bloghub.domain.UserRole;
import com.bloghub.entity.User;
import com.bloghub.exception.NotAllowedhandleException;
import com.bloghub.exception.ResourceAlreadyExistException;
import com.bloghub.mapper.UserMapper;
import com.bloghub.repository.UserRepository;
import com.bloghub.request.payload.dto.UserLoginRequestDTO;
import com.bloghub.request.payload.dto.UserRegisterRequestDTO;
import com.bloghub.response.payload.dto.AuthResponse;
import com.bloghub.service.AuthService;

import lombok.AllArgsConstructor;
import lombok.Builder;

@Service
@AllArgsConstructor
@Builder
public class AuthServiceImpl implements AuthService {
	
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImplementation customUserImplementation;
    
	@Override
public AuthResponse register(UserRegisterRequestDTO request) throws NotAllowedhandleException  {
		  
		      // Step 1: Check if email already taken	
		
				if(userRepository.existsByEmail(request.getEmail())) {
					throw new ResourceAlreadyExistException("Email Already register ");
				}
				
               // Step 2: role validation
				if(request.getRole().equals(UserRole.ADMIN)){
		            throw new NotAllowedhandleException("Role admin is not allowed");
		        }
				
			    User user =UserMapper.toEntity(request);
			    // Encode password
			    user.setPassword(passwordEncoder.encode(user.getPassword()));
			    
			    User saveduser=userRepository.save(user);
					
					  Authentication authentication = new UsernamePasswordAuthenticationToken(
							  saveduser.getEmail(),
						        saveduser.getPassword());
				        SecurityContextHolder.getContext().setAuthentication(authentication);
				        String jwt = jwtProvider.generateToken(authentication);

				        return AuthResponse.builder()
				                .token(jwt)
				                .user(UserMapper.toDTO(saveduser))
				                .message("User registered successfully")				               
				                .build();

	}
	

	
   public Authentication authenticate(String email, String password) throws NotAllowedhandleException {

	        UserDetails userDetails = customUserImplementation.loadUserByUsername(email);
	        if(userDetails == null) {
	            throw new NotAllowedhandleException("email id doesn't exist "+ email);
	        }
	        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
	            throw new NotAllowedhandleException("Wrong Password ");
	        }
	        return new UsernamePasswordAuthenticationToken(email, null, userDetails.getAuthorities());
	    }



   @Override
   public AuthResponse login(UserLoginRequestDTO req) throws NotAllowedhandleException {
	    // Extract email & password from request DTO
	    String email = req.getEmail();
	    String password = req.getPassword();  		
		Authentication authentication = authenticate(email, password);
	        SecurityContextHolder.getContext().setAuthentication(authentication);
	        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
	        String role =  authorities.iterator().next().getAuthority();
	        String token = jwtProvider.generateToken(authentication);
	        // Get Author entity from DB
	        User user = userRepository.findByEmail(email);
	        		if(user==null) {
	        		  throw new NotAllowedhandleException("User not found");	
	        		}
	        		
	        		 //  Update lastLogin
	        	    user.setLastLogin(java.time.LocalDateTime.now());  // or new Date() if using java.util.Date
	        	    userRepository.save(user); // Save the updated lastLogin
	        	    
	        return AuthResponse.builder()
	                .token(token)
	                .user(UserMapper.toDTO(user))
	                .message("Login successful")
	                .build();
   }

   
}
