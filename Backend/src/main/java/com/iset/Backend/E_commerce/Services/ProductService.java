package com.iset.Backend.E_commerce.Services;


import com.iset.Backend.E_commerce.Entities.Dealer;
import com.iset.Backend.E_commerce.Entities.Products;
import com.iset.Backend.E_commerce.Repositories.ProductRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductService {
        @Autowired
        private ProductRepositories productRepositoy;
        private void addProduct(Products product, Dealer dealer){
            productRepositoy.save(product);
        }
        private List<Products> listerProducts(){
            return productRepositoy.findAll();
        }

}
