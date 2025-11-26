package com.iset.Backend.E_commerce.Config;

import com.iset.Backend.E_commerce.Entities.User;
import com.iset.Backend.E_commerce.Repositories.UserRepository;
import com.iset.Backend.E_commerce.Services.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserService userService;

    public AdminInitializer(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        // Créer un admin par défaut si aucun admin n'existe
        long adminCount = userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.ADMIN)
                .count();

        if (adminCount == 0) {
            userService.createUser(
                    "admin",
                    "admin123", // Mot de passe par défaut - À CHANGER en production !
                    "admin@example.com",
                    User.Role.ADMIN,
                    "Admin",
                    "System",
                    null,
                    null);
            System.out.println("═══════════════════════════════════════════════════════");
            System.out.println("⚠️  ADMIN PAR DÉFAUT CRÉÉ ⚠️");
            System.out.println("═══════════════════════════════════════════════════════");
            System.out.println("Email: admin@example.com");
            System.out.println("Mot de passe: admin123");
            System.out.println("⚠️  VEUILLEZ CHANGER CE MOT DE PASSE EN PRODUCTION ! ⚠️");
            System.out.println("═══════════════════════════════════════════════════════");
        }
    }
}
