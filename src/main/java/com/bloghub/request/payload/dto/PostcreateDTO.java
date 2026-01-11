package com.bloghub.request.payload.dto;

import java.time.LocalDateTime;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostcreateDTO {
	    
	   @NotBlank(message="Title is required")
	   private String title;
	   @NotBlank(message = "Content Shoult be required")
	   private String content;
	   private LocalDateTime createdAt=LocalDateTime.now();
	   
	   @NotNull(message = "Author ID is required")
	   @Min(value =1,message = "Auhtor ID should be greater than 0")
	   private Long authorID;
	   
	   @NotNull(message = "Category ID is required")
	   @Min(value=1,message = "Category ID should be greater than 0")
	   private Long categoryID;
	   
}
