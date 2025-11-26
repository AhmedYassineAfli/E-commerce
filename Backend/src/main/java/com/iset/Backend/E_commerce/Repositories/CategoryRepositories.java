package com.iset.Backend.E_commerce.Repositories;

import com.iset.Backend.E_commerce.Entities.Categories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepositories extends JpaRepository<Categories, Long> {
}
