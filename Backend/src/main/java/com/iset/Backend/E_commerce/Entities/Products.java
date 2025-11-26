package com.iset.Backend.E_commerce.Entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })

public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idProduct;
    private String designation;
    private String Description;
    private int quantiteEnstock;
    private double price;
    private Date date;
    @Lob
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(name = "discount")
    private Integer discount = 0; // Pourcentage de remise (0-100)

    @ManyToOne
    @JoinColumn(name = "idCategory", nullable = false)
    private Categories category;

    @ManyToOne
    @JoinColumn(name = "idDealer", nullable = true)
    private Dealer dealer;

    public Products() {
    }

    public Products(long idPro, String designation, String description, int quantiteEnstock, double price, Date date) {
        this.idProduct = idPro;
        this.designation = designation;
        Description = description;
        this.quantiteEnstock = quantiteEnstock;
        this.price = price;
        this.date = date;
    }

    public long getIdPro() {
        return idProduct;
    }

    public void setIdPro(long idPro) {
        this.idProduct = idPro;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantiteEnstock() {
        return quantiteEnstock;
    }

    public void setQuantiteEnstock(int quantiteEnstock) {
        this.quantiteEnstock = quantiteEnstock;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Categories getCategory() {
        return category;
    }

    public void setCategory(Categories category) {
        this.category = category;
    }

    public Dealer getDealer() {
        return dealer;
    }

    public void setDealer(Dealer dealer) {
        this.dealer = dealer;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

}
