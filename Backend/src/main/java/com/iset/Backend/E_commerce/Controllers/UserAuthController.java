package com.iset.Backend.E_commerce.Controllers;

import com.iset.Backend.E_commerce.Entities.User;
import com.iset.Backend.E_commerce.Services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Tag(name = "Authentication", description = "User authentication and registration")
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST,
        RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class UserAuthController {

    private final UserService userService;

    public UserAuthController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "User login (Admin or Customer)")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userService.authenticate(request.getEmail(), request.getPassword());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Connexion réussie");
            response.put("user", new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().toString(),
                    user.getNom(),
                    user.getPrenom(),
                    user.getAdresse(),
                    user.getTelephone()));
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Email ou mot de passe invalide");
            return ResponseEntity.status(401).body(response);
        }
    }

    @Operation(summary = "Register new user")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Par défaut, les nouveaux utilisateurs sont des CUSTOMER
            User.Role role = request.getRole() != null ? request.getRole() : User.Role.CUSTOMER;

            User user = userService.createUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getEmail(),
                    role,
                    request.getNom(),
                    request.getPrenom(),
                    request.getAdresse(),
                    request.getTelephone());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Utilisateur créé avec succès");
            response.put("user", new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().toString(),
                    user.getNom(),
                    user.getPrenom(),
                    user.getAdresse(),
                    user.getTelephone()));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // Request DTOs
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
        private User.Role role;
        private String nom;
        private String prenom;
        private String adresse;
        private String telephone;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public User.Role getRole() {
            return role;
        }

        public void setRole(User.Role role) {
            this.role = role;
        }

        public String getNom() {
            return nom;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public String getPrenom() {
            return prenom;
        }

        public void setPrenom(String prenom) {
            this.prenom = prenom;
        }

        public String getAdresse() {
            return adresse;
        }

        public void setAdresse(String adresse) {
            this.adresse = adresse;
        }

        public String getTelephone() {
            return telephone;
        }

        public void setTelephone(String telephone) {
            this.telephone = telephone;
        }
    }

    // Response DTO
    public static class UserResponse {
        private long id;
        private String username;
        private String email;
        private String role;
        private String nom;
        private String prenom;
        private String adresse;
        private String telephone;

        public UserResponse(long id, String username, String email, String role, String nom, String prenom,
                String adresse, String telephone) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            this.nom = nom;
            this.prenom = prenom;
            this.adresse = adresse;
            this.telephone = telephone;
        }

        public long getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }

        public String getNom() {
            return nom;
        }

        public String getPrenom() {
            return prenom;
        }

        public String getAdresse() {
            return adresse;
        }

        public String getTelephone() {
            return telephone;
        }
    }
}
