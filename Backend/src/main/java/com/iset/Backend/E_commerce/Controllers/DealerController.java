package com.iset.Backend.E_commerce.Controllers;

import com.iset.Backend.E_commerce.Entities.Dealer;
import com.iset.Backend.E_commerce.Repositories.DealerRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Dealers", description = "Manage dealers")
@RestController
@RequestMapping("/dealers")
public class DealerController {

    private final DealerRepositories dealerRepositories;

    public DealerController(DealerRepositories dealerRepositories) {
        this.dealerRepositories = dealerRepositories;
    }

    @Operation(summary = "Create a dealer")
    @PostMapping
    public ResponseEntity<Dealer> create(@RequestBody DealerRequest request) {
        Dealer d = new Dealer();
        d.setEmail(request.getEmail());
        d.setAdresse(request.getAdresse());
        d.setNumTel(request.getNumTel());
        Dealer saved = dealerRepositories.save(d);
        return ResponseEntity.created(URI.create("/dealers/" + saved.getIdfor())).body(saved);
    }

    @Operation(summary = "List dealers")
    @GetMapping
    public ResponseEntity<List<Dealer>> list() {
        return ResponseEntity.ok(dealerRepositories.findAll());
    }

    public static class DealerRequest {
        private String email;
        private String adresse;
        private String numTel;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getAdresse() { return adresse; }
        public void setAdresse(String adresse) { this.adresse = adresse; }
        public String getNumTel() { return numTel; }
        public void setNumTel(String numTel) { this.numTel = numTel; }
    }
}


