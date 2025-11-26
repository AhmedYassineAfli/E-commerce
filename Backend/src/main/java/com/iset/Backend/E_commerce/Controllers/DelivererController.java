package com.iset.Backend.E_commerce.Controllers;

import com.iset.Backend.E_commerce.Entities.Order;
import com.iset.Backend.E_commerce.Entities.User;
import com.iset.Backend.E_commerce.Services.DelivererService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliverer")
@CrossOrigin(origins = "http://localhost:4200")
public class DelivererController {

    @Autowired
    private DelivererService delivererService;

    /**
     * Récupère toutes les commandes confirmées (disponibles pour assignation)
     */
    @GetMapping("/orders/available")
    public ResponseEntity<List<Order>> getAvailableOrders() {
        List<Order> orders = delivererService.getConfirmedOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * Récupère les commandes assignées à un livreur
     */
    @GetMapping("/orders/{delivererId}")
    public ResponseEntity<List<Order>> getDelivererOrders(@PathVariable Long delivererId) {
        List<Order> orders = delivererService.getDelivererOrders(delivererId);
        return ResponseEntity.ok(orders);
    }

    /**
     * Assigne une commande à un livreur
     */
    @PostMapping("/assign/{orderId}/{delivererId}")
    public ResponseEntity<?> assignOrder(@PathVariable Long orderId, @PathVariable Long delivererId) {
        try {
            Order order = delivererService.assignOrder(orderId, delivererId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Démarre la livraison
     */
    @PostMapping("/start/{orderId}/{delivererId}")
    public ResponseEntity<?> startDelivery(@PathVariable Long orderId, @PathVariable Long delivererId) {
        try {
            Order order = delivererService.startDelivery(orderId, delivererId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Confirme la livraison (check-in)
     */
    @PostMapping("/confirm/{orderId}/{delivererId}")
    public ResponseEntity<?> confirmDelivery(@PathVariable Long orderId, @PathVariable Long delivererId) {
        try {
            Order order = delivererService.confirmDelivery(orderId, delivererId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Récupère tous les livreurs (pour l'admin)
     */
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllDeliverers() {
        List<User> deliverers = delivererService.getAllDeliverers();
        return ResponseEntity.ok(deliverers);
    }
}
