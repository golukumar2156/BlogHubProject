package com.bloghub.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.bloghub.domain.UserRole;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    private String about;
    
    @OneToMany(mappedBy ="author", cascade =CascadeType.ALL)
    List<Post> postsuthors; 
    
    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    
    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime lastLogin;
    
    @Column(nullable = false)
    private Boolean verified = false;


}

