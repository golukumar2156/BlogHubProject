package com.bloghub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionhandle {
	
	@ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> resourceNotFound(ResourceNotFoundException ex){
    	        ErrorResponse ob=new ErrorResponse(HttpStatus.NOT_FOUND.value(),ex.getMessage());
    	        return new  ResponseEntity<>(ob,HttpStatus.NOT_FOUND);
    }
	
	@ExceptionHandler(ResourceAlreadyExistException.class)
	public ResponseEntity<ErrorResponse>  resourceAlreadyExists(ResourceAlreadyExistException ex){
	          ErrorResponse ob= new ErrorResponse(HttpStatus.CONFLICT.value(),ex.getMessage());
	          return new ResponseEntity<>(ob,HttpStatus.CONFLICT);
	}
}
