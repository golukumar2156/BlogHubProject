package com.bloghub.responsepayload.dto;

import com.bloghub.dto.AuthResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String message;
    private AuthResponseDTO author;
}
