package com.bloghub.request.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostUpdateDTO {
	
	   private String title;
	   private String content;
	   
	   private Long authorID;
	   
	   private Long categoryID;

}
