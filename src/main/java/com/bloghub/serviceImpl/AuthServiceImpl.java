package com.bloghub.serviceImpl;

import org.springframework.stereotype.Service;
import com.bloghub.dto.AuthResponseDTO;
import com.bloghub.dto.LoginRequest;
import com.bloghub.dto.RegisterRequestDTO;
import com.bloghub.entity.Author;
import com.bloghub.exception.ResourceAlreadyExistException;
import com.bloghub.exception.ResourceNotFoundException;
import com.bloghub.repository.AuthorRepository;
import com.bloghub.service.AuthService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
	
	private final AuthorRepository authorRepository;
	
	public AuthResponseDTO register(RegisterRequestDTO request,HttpSession session) {
		
        // Step 1: Check if email already taken		
		if(authorRepository.existsByEmail(request.getEmail())) {
			throw new ResourceAlreadyExistException("Email Already register ");
		}
		
        // Step 2: Create new author		
		Author author=new Author();
		author.setName(request.getName());
		author.setEmail(request.getEmail());
		author.setPassword(request.getPassword());
		author.setAbout(request.getAbout());
		author.setRole("USER");
		Author savedAuthor=authorRepository.save(author);
		
        // Step 4: Create session - Store user info in session		
		session.setAttribute("userId", savedAuthor);
		session.setAttribute("userRole", savedAuthor);
		session.setAttribute("userName", savedAuthor);
		session.setAttribute("userEmail", savedAuthor);
		
        //Step 5: Return success response		
		return new AuthResponseDTO(
				savedAuthor.getID(),
				savedAuthor.getName(),
				savedAuthor.getEmail(),
				savedAuthor.getRole(),
				"Registration successfully"
				);
		
	}
	
	public AuthResponseDTO login(LoginRequest request, HttpSession session) {
		
			    // Find user by email
			    Author author = authorRepository
			    		.findByEmail(request.getEmail())
			    		.orElseThrow(()->new ResourceNotFoundException("Invalid email or password"));		
		
			    if (!author.getPassword().equals(request.getPassword())) {
		            throw new ResourceNotFoundException("Invalid email or password");
		        }
		
		        session.setAttribute("userId", author.getID());
		        session.setAttribute("userRole", author.getRole());
		        session.setAttribute("userName", author.getName());
		        session.setAttribute("userEmail", author.getEmail());
		
		        return new AuthResponseDTO(
		                author.getID(),
		                author.getName(),
		                author.getEmail(),
		                author.getRole(),
		                "Login successfully"
		        );		
				
	 }
	
	public AuthResponseDTO getCurrentUser(HttpSession session) {
				 Long userId=(Long) session.getAttribute("userId");
				 if(userId==null) {
					 throw new ResourceNotFoundException("No user loged In!");
				   }
				 String userName=(String)session.getAttribute("username");
				 String userEmail=(String)session.getAttribute("userEmail");
				 String userRole=(String) session.getAttribute("userRole");
				 return new AuthResponseDTO(userId,userName,userEmail,userRole,"Current User Information");
	 }

	@Override
	public void Logout(HttpSession session) {
		         session.invalidate();		
	}
	
}
