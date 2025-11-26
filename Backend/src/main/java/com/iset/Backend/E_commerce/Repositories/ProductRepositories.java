package com.iset.Backend.E_commerce.Repositories;

import com.iset.Backend.E_commerce.Entities.Products;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepositories extends JpaRepository<Products, Long> {
    java.util.List<Products> findByCategory_IdCategory(Long idCategory);
}
