package com.iset.Backend.E_commerce.Controllers;

import com.iset.Backend.E_commerce.Entities.Categories;
import com.iset.Backend.E_commerce.Entities.Dealer;
import com.iset.Backend.E_commerce.Entities.Products;
import com.iset.Backend.E_commerce.Repositories.CategoryRepositories;
import com.iset.Backend.E_commerce.Repositories.DealerRepositories;
import com.iset.Backend.E_commerce.Repositories.ProductRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Products", description = "CRUD for products")
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepositories productRepositories;
    private final CategoryRepositories categoryRepositories;
    private final DealerRepositories dealerRepositories;

    public ProductController(ProductRepositories productRepositories,
            CategoryRepositories categoryRepositories,
            DealerRepositories dealerRepositories) {
        this.productRepositories = productRepositories;
        this.categoryRepositories = categoryRepositories;
        this.dealerRepositories = dealerRepositories;
    }

    @Operation(summary = "Create a new product")
    @PostMapping
    public ResponseEntity<Products> create(@RequestBody ProductRequest request) {
        Optional<Categories> categoryOpt = categoryRepositories.findById(request.getCategoryId());

        if (categoryOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Products p = new Products();
        p.setDesignation(request.getDesignation());
        p.setDescription(request.getDescription());
        p.setQuantiteEnstock(request.getQuantiteEnstock());
        p.setPrice(request.getPrice());
        p.setDate(request.getDate());
        p.setImageUrl(request.getImageUrl());
        p.setCategory(categoryOpt.get());

        if (request.getDealerId() != null) {
            Optional<Dealer> dealerOpt = dealerRepositories.findById(request.getDealerId());
            dealerOpt.ifPresent(p::setDealer);
        }

        Products saved = productRepositories.save(p);
        return ResponseEntity.created(URI.create("/products/" + saved.getIdPro())).body(saved);
    }

    @Operation(summary = "List products (optional category filter)")
    @GetMapping
    public ResponseEntity<List<Products>> list(@RequestParam(value = "categoryId", required = false) Long categoryId) {
        List<Products> all = (categoryId == null)
                ? productRepositories.findAll()
                : productRepositories.findByCategory_IdCategory(categoryId);
        return ResponseEntity.ok(all);
    }

    @Operation(summary = "Get product by id")
    @GetMapping("/{id}")
    public ResponseEntity<Products> getById(@PathVariable("id") long id) {
        return productRepositories.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update a product")
    @PutMapping("/{id}")
    public ResponseEntity<Products> update(@PathVariable("id") long id, @RequestBody ProductRequest request) {
        Optional<Products> existingOpt = productRepositories.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Products p = existingOpt.get();

        if (request.getDesignation() != null)
            p.setDesignation(request.getDesignation());
        if (request.getDescription() != null)
            p.setDescription(request.getDescription());
        if (request.getQuantiteEnstock() != null)
            p.setQuantiteEnstock(request.getQuantiteEnstock());
        if (request.getPrice() != null)
            p.setPrice(request.getPrice());
        if (request.getDate() != null)
            p.setDate(request.getDate());
        if (request.getImageUrl() != null)
            p.setImageUrl(request.getImageUrl());

        if (request.getCategoryId() != null) {
            Optional<Categories> categoryOpt = categoryRepositories.findById(request.getCategoryId());
            categoryOpt.ifPresent(p::setCategory);
        }
        if (request.getDealerId() != null) {
            Optional<Dealer> dealerOpt = dealerRepositories.findById(request.getDealerId());
            dealerOpt.ifPresent(p::setDealer);
        }

        if (request.getDiscount() != null) {
            // Validate discount is between 0 and 100
            if (request.getDiscount() >= 0 && request.getDiscount() <= 100) {
                p.setDiscount(request.getDiscount());
            }
        }

        Products saved = productRepositories.save(p);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "Delete a product")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        if (!productRepositories.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepositories.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update product discount")
    @PatchMapping("/{id}/discount")
    public ResponseEntity<Products> updateDiscount(@PathVariable("id") long id, @RequestBody DiscountRequest request) {
        Optional<Products> existingOpt = productRepositories.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Products p = existingOpt.get();

        if (request.getDiscount() != null) {
            if (request.getDiscount() >= 0 && request.getDiscount() <= 100) {
                p.setDiscount(request.getDiscount());
            } else {
                return ResponseEntity.badRequest().build();
            }
        }

        Products saved = productRepositories.save(p);
        return ResponseEntity.ok(saved);
    }

    public static class DiscountRequest {
        private Integer discount;

        public Integer getDiscount() {
            return discount;
        }

        public void setDiscount(Integer discount) {
            this.discount = discount;
        }
    }

    public static class ProductRequest {
        private String designation;
        private String description;
        private Integer quantiteEnstock;
        private Double price;
        private Date date;
        private Long categoryId;
        private Long dealerId;
        private String imageUrl;
        private Integer discount;

        public String getDesignation() {
            return designation;
        }

        public void setDesignation(String designation) {
            this.designation = designation;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Integer getQuantiteEnstock() {
            return quantiteEnstock;
        }

        public void setQuantiteEnstock(Integer quantiteEnstock) {
            this.quantiteEnstock = quantiteEnstock;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public Date getDate() {
            return date;
        }

        public void setDate(Date date) {
            this.date = date;
        }

        public Long getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Long categoryId) {
            this.categoryId = categoryId;
        }

        public Long getDealerId() {
            return dealerId;
        }

        public void setDealerId(Long dealerId) {
            this.dealerId = dealerId;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public Integer getDiscount() {
            return discount;
        }

        public void setDiscount(Integer discount) {
            this.discount = discount;
        }
    }
}
