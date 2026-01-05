package com.bloghub.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.bloghub.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	boolean existsByCatName(String catName);
}
