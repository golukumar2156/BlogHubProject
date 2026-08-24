package com.bloghub.mapper;

import com.bloghub.entity.Category;
import com.bloghub.request.payload.dto.CategoryCreateDTO;
import com.bloghub.response.payload.dto.CategoryResponseDTO;

public class CategoryMapper {

    // CREATE DTO -> ENTITY
    public static Category toEntity(CategoryCreateDTO dto) {
        Category category = new Category();
        category.setCatName(dto.getCatName());
        category.setDescription(dto.getDescription());
        return category;
    }

    // ENTITY -> RESPONSE DTO
    public static CategoryResponseDTO toDto(Category category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setID(category.getID());
        dto.setCatName(category.getCatName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}
