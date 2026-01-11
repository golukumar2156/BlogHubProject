package com.bloghub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bloghub.entity.Post;
import com.bloghub.entity.User;

public interface PostRepository  extends JpaRepository<Post, Long> {
	 List<Post> findByTitleContainingOrContentContaining(String title, String content);
     List<Post> findByAuthor(User author);
}
