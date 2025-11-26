package com.iset.Backend.E_commerce.Entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@Entity
@JsonIgnoreProperties({"produits"})
public class Dealer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idDealer;
    private String email;
    private String adresse;
    private String NumTel;

    @OneToMany(mappedBy = "dealer")

    private List<Products> produits;


    public Dealer() {}


    public Dealer(String numTel, String adresse, String email, long idfor) {
        NumTel = numTel;
        this.adresse = adresse;
        this.email = email;
        this.idDealer = idDealer;
    }

    public List<Products> getProduits() {
        return produits;
    }

    public long getIdfor() {
        return idDealer;
    }

    public void setIdfor(long idfor) {
        this.idDealer = idfor;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getNumTel() {
        return NumTel;
    }

    public void setNumTel(String numTel) {
        NumTel = numTel;
    }
}
