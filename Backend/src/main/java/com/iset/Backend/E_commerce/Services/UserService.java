package com.iset.Backend.E_commerce.Services;

import com.iset.Backend.E_commerce.Entities.User;
import com.iset.Backend.E_commerce.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String hashedPassword = hashPassword(password);
            if (hashedPassword.equals(user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public User createUser(String username, String password, String email, User.Role role,
            String nom, String prenom, String adresse, String telephone) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Le nom d'utilisateur existe déjà");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("L'email existe déjà");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(hashPassword(password));
        user.setEmail(email);
        user.setRole(role);
        user.setNom(nom);
        user.setPrenom(prenom);
        user.setAdresse(adresse);
        user.setTelephone(telephone);

        return userRepository.save(user);
    }
}
