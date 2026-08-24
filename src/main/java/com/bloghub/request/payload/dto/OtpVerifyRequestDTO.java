package com.bloghub.request.payload.dto;

import lombok.Data;

@Data
public class OtpVerifyRequestDTO {
    private String email;
    private String otp;
}
