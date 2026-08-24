package com.bloghub.service;

import java.util.List;

import com.bloghub.request.payload.dto.CategoryCreateDTO;
import com.bloghub.request.payload.dto.CategoryUpdateDTO;
import com.bloghub.response.payload.dto.CategoryResponseDTO;

public interface CategoryService {

    CategoryResponseDTO createCategory(CategoryCreateDTO req);

    List<CategoryResponseDTO> getAllCategories();

    CategoryResponseDTO getCategoryById(Long id);

    CategoryResponseDTO updateCategory(Long id, CategoryUpdateDTO upd);

    void deleteCategory(Long id);
}
