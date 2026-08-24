package com.bloghub.emailverifications;

import com.bloghub.entity.User;

public class PendingUser {

    private User user;
    private String otp;

    public PendingUser(User user, String otp) {
        this.user = user;
        this.otp = otp;
    }

    public User getUser() {
        return user;
    }

    public String getOtp() {
        return otp;
    }
}
