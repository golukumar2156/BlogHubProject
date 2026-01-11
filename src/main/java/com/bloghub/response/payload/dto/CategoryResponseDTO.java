package com.bloghub.response.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDTO {	
	  private Long ID;
      private String catName;	 
      private String Description;
}
