package com.bloghub.request.payload.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCreateDTO {
	
	  @NotBlank(message = "CatName should be required")
      private String catName;
	  
	  @NotBlank(message = "Description should be required")
      private String Description;
}
