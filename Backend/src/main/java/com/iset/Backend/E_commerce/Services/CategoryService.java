package com.iset.Backend.E_commerce.Services;

import com.iset.Backend.E_commerce.Entities.Categories;
import com.iset.Backend.E_commerce.Entities.Products;
import com.iset.Backend.E_commerce.Repositories.CategoryRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class CategoryService {
    @Autowired
    private CategoryRepositories categoryRepository;
    private void addCategory(Categories category){
        categoryRepository.save(category);
    }
    private void addProducts(Products products, Categories category){
        Categories cat=categoryRepository.getReferenceById(category.getIdCategory());
    }
}
