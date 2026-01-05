package com.bloghub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bloghub.entity.Author;
import com.bloghub.entity.Post;

public interface PostRepository  extends JpaRepository<Post, Long> {
     List<Post> findByTitleContainnigOrContentContainning(String title,String content);
     List<Post> findByAuthor(Author author);
}
