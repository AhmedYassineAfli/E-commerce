package com.iset.Backend.E_commerce.Controllers;

import com.iset.Backend.E_commerce.Entities.Categories;
import com.iset.Backend.E_commerce.Repositories.CategoryRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Categories", description = "Manage categories")
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryRepositories categoryRepositories;

    public CategoryController(CategoryRepositories categoryRepositories) {
        this.categoryRepositories = categoryRepositories;
    }

    @Operation(summary = "Create a category")
    @PostMapping
    public ResponseEntity<Categories> create(@RequestBody CategoryRequest request) {
        Categories c = new Categories();
        c.setLibelleCat(request.getLibelleCat());
        Categories saved = categoryRepositories.save(c);
        return ResponseEntity.created(URI.create("/categories/" + saved.getIdCategory())).body(saved);
    }

    @Operation(summary = "List categories")
    @GetMapping
    public ResponseEntity<List<Categories>> list() {
        return ResponseEntity.ok(categoryRepositories.findAll());
    }

    public static class CategoryRequest {
        private String libelleCat;
        public String getLibelleCat() { return libelleCat; }
        public void setLibelleCat(String libelleCat) { this.libelleCat = libelleCat; }
    }
}


