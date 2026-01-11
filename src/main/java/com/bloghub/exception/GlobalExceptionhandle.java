package com.bloghub.exception;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

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
	
	@ExceptionHandler(NotAllowedhandleException.class)
	public ResponseEntity<ErrorResponse>  NotallowedhandleException(NotAllowedhandleException ex){
	          ErrorResponse ob= new ErrorResponse(HttpStatus.BAD_REQUEST.value(),ex.getMessage());
	          return new ResponseEntity<>(ob,HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(value=MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
		Map<String ,String> errorMap=new HashMap<>();
		BindingResult br=ex.getBindingResult();
		List<FieldError> errorList=br.getFieldErrors();
		for(FieldError ferror:errorList) {
			errorMap.put(ferror.getField(),ferror.getDefaultMessage());
		}		
		return new ResponseEntity<Map<String,String>>(errorMap,HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(value=Exception.class)
	public ResponseEntity<ErrorResponse> handleException(Exception ex){
		 ErrorResponse re=new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),ex.getMessage());
		 return new ResponseEntity<>(re,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
	    
	    String message = "Invalid request body";

	    // Check if the cause is enum deserialization
	    if(ex.getCause() instanceof InvalidFormatException invalidEx) {
	        if(invalidEx.getTargetType().isEnum()) {
	            message = "Invalid value '" + invalidEx.getValue() + "' for field '" 
	                      + invalidEx.getPath().get(0).getFieldName() 
	                      + "'. Accepted values: " + List.of(invalidEx.getTargetType().getEnumConstants());
	        }
	    }

	    ErrorResponse re = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), message);
	    return new ResponseEntity<>(re, HttpStatus.BAD_REQUEST);
	}
	
}
