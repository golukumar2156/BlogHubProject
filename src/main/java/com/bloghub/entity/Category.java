package com.bloghub.entity;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="categories")
public class Category {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long ID;
   
   @Column(unique = true)
   private String catName;
   private String description;
   
   @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
   private List<Post> posts;
   
}
