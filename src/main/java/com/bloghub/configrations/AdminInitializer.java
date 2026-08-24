package com.bloghub.configrations;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bloghub.entity.User;
import com.bloghub.domain.UserRole;
import com.bloghub.repository.UserRepository;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
               
            String adminEmail = "golusiddharth88@gmail.com";

            // already admin hai to kuch mat karo
            if (userRepository.existsByEmail(adminEmail)) {
                return;
            }

            User admin = new User();
            admin.setFullName("Golu Siddharth");
            admin.setPhone("7782949175");
            admin.setAbout("I am the super administrator of BlogHub application");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin@123"));
            admin.setRole(UserRole.ADMIN);
            admin.setVerified(true);
            admin.setEmailVerified(true);
            userRepository.save(admin);

            System.out.println("ADMIN CREATED SUCCESSFULLY");
        };
    }
}
