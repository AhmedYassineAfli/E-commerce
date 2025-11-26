package com.iset.Backend.E_commerce.Services;

import com.iset.Backend.E_commerce.Entities.Dealer;
import com.iset.Backend.E_commerce.Entities.Products;
import com.iset.Backend.E_commerce.Repositories.DealerRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DealerService {
    @Autowired
    private DealerRepositories dealerRepository;

    private void addDealer(Dealer dealer){
        dealerRepository.save(dealer);
    }
    private void addProduct(Dealer dealer, Products products){
        dealer.getProduits().add(products);
    }
}
