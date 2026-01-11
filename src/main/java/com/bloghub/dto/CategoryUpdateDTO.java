package com.bloghub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryUpdateDTO {
	
      private String catName;
	  
      private String Description;
}
