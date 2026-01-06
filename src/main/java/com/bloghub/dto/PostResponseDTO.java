package com.bloghub.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostResponseDTO {
    
	   private Long ID;
	   private String title;
	   private String content;
	   private LocalDateTime createdAt;
	   
	   private Long authorID;
	   private String authorName;
	   
	   private Long categoryID;
	   private String categoryName;
}
