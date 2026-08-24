package com.bloghub.configrations;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint{

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
	                     AuthenticationException authException) throws IOException {

	    response.setContentType("application/json");
	    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

	    // JSON structure like ErrorResponse
	    String json = String.format(
	        "{\"timestamp\": \"%s\", \"status\": %d, \"error\": \"%s\", \"message\": \"%s\", \"path\": \"%s\"}",
	        java.time.Instant.now(),
	        HttpServletResponse.SC_UNAUTHORIZED,
	        "Unauthorized",
	        authException.getMessage(),
	        request.getRequestURI()
	    );

	    response.getWriter().write(json);
	}


}
