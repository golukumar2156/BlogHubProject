package com.bloghub.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bloghub.domain.UserRole;
import com.bloghub.entity.Category;
import com.bloghub.entity.User;
import com.bloghub.exception.ResourceAlreadyExistException;
import com.bloghub.exception.ResourceNotFoundException;
import com.bloghub.mapper.CategoryMapper;
import com.bloghub.repository.CategoryRepository;
import com.bloghub.repository.UserRepository;
import com.bloghub.request.payload.dto.CategoryCreateDTO;
import com.bloghub.request.payload.dto.CategoryUpdateDTO;
import com.bloghub.response.payload.dto.CategoryResponseDTO;
import com.bloghub.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    @Override
    public CategoryResponseDTO createCategory(CategoryCreateDTO req) {

        //  JWT se logged-in user
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null || auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Unauthorized");
        }

        User user = Optional
                .ofNullable(userRepository.findByEmail(auth.getName()))
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        //  ADMIN CHECK
        if (user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only ADMIN can create category");
        }

        // duplicate check
        if (categoryRepository.existsByCatName(req.getCatName())) {
            throw new RuntimeException("Category name already exists");
        }

        Category category = CategoryMapper.toEntity(req);
        Category saved = categoryRepository.save(category);

        return CategoryMapper.toDto(saved);
    }


    @Override
    public List<CategoryResponseDTO> getAllCategories() {

        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponseDTO> responseList = new ArrayList<>();

        for (Category cat : categories) {
            responseList.add(CategoryMapper.toDto(cat));
        }
        return responseList;
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long id) {

        Category category = categoryRepository.findById(id).orElse(null);

        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }

        return CategoryMapper.toDto(category);
    }

    @Override
    public CategoryResponseDTO updateCategory(Long id, CategoryUpdateDTO upd) {

        Category category = categoryRepository.findById(id).orElse(null);

        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
       

        //  YE CHECK ADD KARO
        if (upd.getCatName() != null &&
            categoryRepository.existsByCatName(upd.getCatName()) &&
            !category.getCatName().equals(upd.getCatName())) {

            throw new ResourceAlreadyExistException("Category name already exists");
        }
        
        if (upd == null ||
           (upd.getCatName() == null && upd.getDescription() == null)) {
            throw new IllegalArgumentException("At least one field must be provided");
        }

        if (upd.getCatName() != null) {
            category.setCatName(upd.getCatName());
        }

        if (upd.getDescription() != null) {
            category.setDescription(upd.getDescription());
        }

        Category updated = categoryRepository.save(category);
        return CategoryMapper.toDto(updated);
    }

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id).orElse(null);

        if (category == null) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }

        categoryRepository.delete(category);
    }
}
