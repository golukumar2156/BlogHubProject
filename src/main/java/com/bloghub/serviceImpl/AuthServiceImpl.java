package com.bloghub.serviceImpl;

import java.util.Collection;

import javax.mail.MessagingException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bloghub.configrations.JwtProvider;
import com.bloghub.domain.UserRole;
import com.bloghub.emailverifications.MailUtil;
import com.bloghub.emailverifications.OTPUtil;
import com.bloghub.emailverifications.PendingUser;
import com.bloghub.emailverifications.PendingUserStore;
import com.bloghub.entity.User;
import com.bloghub.exception.NotAllowedhandleException;
import com.bloghub.exception.ResourceAlreadyExistException;
import com.bloghub.mapper.UserMapper;
import com.bloghub.repository.UserRepository;
import com.bloghub.request.payload.dto.UserLoginRequestDTO;
import com.bloghub.request.payload.dto.UserRegisterRequestDTO;
import com.bloghub.response.payload.dto.AuthResponse;
import com.bloghub.service.AuthService;

import lombok.AllArgsConstructor;
import lombok.Builder;

@Service
@AllArgsConstructor
@Builder
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImplementation customUserImplementation;

    // ================= REGISTER =================
    @Override
    public AuthResponse register(UserRegisterRequestDTO request)
            throws NotAllowedhandleException, MessagingException {

        // 1 email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistException("Email already registered");
        }

        // 2️ role validation
        if (request.getRole().equals(UserRole.ADMIN)) {
            throw new NotAllowedhandleException("Role admin is not allowed");
        }

        User user = UserMapper.toEntity(request);
        user.setRole(UserRole.AUTHOR);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEmailVerified(false);
        System.out.println("OTP SEND ");
        // 3️ OTP generate
        String otp = OTPUtil.generateOTP();
        System.out.println("OTP GENERATED = " + otp);
        // 4️ TEMP store (DB me save nahi)
        PendingUser pendingUser = new PendingUser(user, otp);
        PendingUserStore.save(request.getEmail(), pendingUser);
        System.out.println("OTP GENERATED = " + otp);
        System.out.println("BEFORE MAIL SEND");

        // 5️ send OTP mail
        MailUtil.sendOTP(request.getEmail(), otp);


        System.out.println("AFTER MAIL SEND");
        return AuthResponse.builder()
                .message("OTP sent to email. Please verify")
                .build();
    }

    // ================= VERIFY OTP =================
    @Override
    public AuthResponse verifyOtp(String email, String otp) {

        PendingUser pending = PendingUserStore.get(email);

        if (pending == null) {
            throw new NotAllowedhandleException("OTP expired or invalid");
        }

        if (!pending.getOtp().equals(otp)) {
            throw new NotAllowedhandleException("Invalid OTP");
        }

        User savedUser = pending.getUser();
        savedUser.setEmailVerified(true);

        //  AB DB SAVE
        userRepository.save(savedUser);

        //  cleanup
        PendingUserStore.remove(email);

        //  JWT (YAHI RAHEGA — NO CHANGE)
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        savedUser.getEmail(),
                        savedUser.getPassword()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .user(UserMapper.toDTO(savedUser))
                .message("User registered successfully")
                .build();
    }

    // ================= AUTHENTICATE =================
    public Authentication authenticate(String email, String password)
            throws NotAllowedhandleException {

        UserDetails userDetails =
                customUserImplementation.loadUserByUsername(email);

        if (userDetails == null) {
            throw new NotAllowedhandleException("Email not found: " + email);
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new NotAllowedhandleException("Wrong password");
        }

        return new UsernamePasswordAuthenticationToken(
                email, null, userDetails.getAuthorities());
    }

    // ================= LOGIN =================
    @Override
    public AuthResponse login(UserLoginRequestDTO req)
            throws NotAllowedhandleException {

        Authentication authentication =
                authenticate(req.getEmail(), req.getPassword());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role =  authorities.iterator().next().getAuthority();
        String token = jwtProvider.generateToken(authentication);
        User user = userRepository.findByEmail(req.getEmail());
        if (user == null) {
            throw new NotAllowedhandleException("User not found");
        }

        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);

        return AuthResponse.builder()
                .token(token)
                .user(UserMapper.toDTO(user))
                .message("Login successful")
                .build();
    }
}
