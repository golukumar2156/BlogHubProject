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
	
    private final AuthorRepository authorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImplementation customUserImplementation;
    
	@Override
public AuthResponse register(RegisterRequestDTO request) throws NotAllowedhandleException  {
		  
		// Step 1: Check if email already taken		
				if(authorRepository.existsByEmail(request.getEmail())) {
					throw new ResourceAlreadyExistException("Email Already register ");
				}
				   //  role validation
			    if (request.getRole() != null &&
			        !"USER".equalsIgnoreCase(request.getRole())) {
			        throw new NotAllowedhandleException(
			            "Only USER role is allowed at the moment"
			        );
			    }
				 
					Author author=new Author();
					author.setName(request.getName());
					author.setEmail(request.getEmail());
					author.setPassword(passwordEncoder.encode(request.getPassword()));
					author.setAbout(request.getAbout());
					author.setRole(request.getRole());
					Author savedAuthor=authorRepository.save(author);
					
					  Authentication authentication = new UsernamePasswordAuthenticationToken(
							  savedAuthor.getEmail(),
						        savedAuthor.getPassword());
				        SecurityContextHolder.getContext().setAuthentication(authentication);
				        String jwt = jwtProvider.generateToken(authentication);

				        return AuthResponse.builder()
				                .token(jwt)
				                .author(Authormapper.toDTO(savedAuthor))
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
   public AuthResponse login(LoginRequest req) throws NotAllowedhandleException {
	    // Extract email & password from request DTO
	    String email = req.getEmail();
	    String password = req.getPassword();  		
		Authentication authentication = authenticate(email, password);
	        SecurityContextHolder.getContext().setAuthentication(authentication);
	        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
	        String role =  authorities.iterator().next().getAuthority();
	        String token = jwtProvider.generateToken(authentication);
	        // Get Author entity from DB
	        Author user = authorRepository.findByEmail(email);
	        		if(user==null) {
	        		  throw new NotAllowedhandleException("User not found");	
	        		}

	        return AuthResponse.builder()
	                .token(token)
	                .author(Authormapper.toDTO(user))
	                .message("Login successful")
	                .build();
   }

   
}
