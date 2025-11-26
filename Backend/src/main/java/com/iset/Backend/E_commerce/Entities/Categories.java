package com.iset.Backend.E_commerce.Entities;


import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@Entity
@JsonIgnoreProperties({"produits"})
public class Categories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idCategory;
    private String libelleCat;


    @OneToMany(mappedBy = "category")
    private List<Products> produits;



    public Categories() {}


    public Categories(long idCat, String libelleCat) {
        this.idCategory = idCat;
        this.libelleCat = libelleCat;
    }

    public long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(long idCategory) {
        this.idCategory = idCategory;
    }

    public String getLibelleCat() {
        return libelleCat;
    }

    public void setLibelleCat(String libelleCat) {
        this.libelleCat = libelleCat;
    }
}

