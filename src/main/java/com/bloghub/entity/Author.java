package com.bloghub.entity;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="authors")
public class Author {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private String name;
   @Column(unique=true)
   private String email;
   private String password;
   private String about;
   
   @CreationTimestamp
   @Column(updatable = false)
   private LocalDateTime createdAt;
   
   @Column(nullable = false)
   private String role;
   @OneToMany(mappedBy ="author", cascade =CascadeType.ALL)
   List<Post> postsuthors; 
   
   public Author(String name, String email, String password, String about) {
	this.name = name;
	this.email = email;
	this.password = password;
	this.about = about;
	}
	   
}
