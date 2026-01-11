package com.bloghub.request.payload.dto;

import lombok.Data;

@Data
public class UserUpdateRequestDTO {
	private String fullName;
    private String phone;
}
