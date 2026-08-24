package com.bloghub.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="posts")
public class Post {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long ID;
   @Column(length = 500)
   private String title;
   @Column(length = 2000)
   private String content;
   private LocalDateTime createdAt;
   
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "author_Id",nullable = false)
   private User author;
   
// ── NEW: stores /uploads/images/filename.jpg ──
   private String imageUrl;
   
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "categories_Id", nullable=false)
   private Category category;
   
}
