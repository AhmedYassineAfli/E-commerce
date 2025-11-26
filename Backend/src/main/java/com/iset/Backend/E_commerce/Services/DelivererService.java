package com.iset.Backend.E_commerce.Services;

import com.iset.Backend.E_commerce.Entities.Order;
import com.iset.Backend.E_commerce.Entities.User;
import com.iset.Backend.E_commerce.Repositories.OrderRepository;
import com.iset.Backend.E_commerce.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DelivererService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Récupère toutes les commandes confirmées (prêtes à être assignées)
     */
    public List<Order> getConfirmedOrders() {
        return orderRepository.findByStatus(Order.OrderStatus.CONFIRMED);
    }

    /**
     * Récupère les commandes assignées à un livreur spécifique
     */
    public List<Order> getDelivererOrders(Long delivererId) {
        return orderRepository.findByDelivererId(delivererId);
    }

    /**
     * Assigne une commande à un livreur
     */
    @Transactional
    public Order assignOrder(Long orderId, Long delivererId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        User deliverer = userRepository.findById(delivererId)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));

        if (deliverer.getRole() != User.Role.DELIVERER) {
            throw new RuntimeException("L'utilisateur n'est pas un livreur");
        }

        if (order.getStatus() != Order.OrderStatus.CONFIRMED) {
            throw new RuntimeException("La commande doit être confirmée pour être assignée");
        }

        order.setDeliverer(deliverer);
        order.setStatus(Order.OrderStatus.ASSIGNED);

        return orderRepository.save(order);
    }

    /**
     * Démarre la livraison (le livreur a pris en charge la commande)
     */
    @Transactional
    public Order startDelivery(Long orderId, Long delivererId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        if (order.getDeliverer() == null || order.getDeliverer().getId() != delivererId) {
            throw new RuntimeException("Cette commande n'est pas assignée à ce livreur");
        }

        if (order.getStatus() != Order.OrderStatus.ASSIGNED) {
            throw new RuntimeException("La commande doit être assignée pour démarrer la livraison");
        }

        order.setStatus(Order.OrderStatus.DELIVERING);

        return orderRepository.save(order);
    }

    /**
     * Confirme la livraison (check-in)
     */
    @Transactional
    public Order confirmDelivery(Long orderId, Long delivererId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        if (order.getDeliverer() == null || order.getDeliverer().getId() != delivererId) {
            throw new RuntimeException("Cette commande n'est pas assignée à ce livreur");
        }

        if (order.getStatus() != Order.OrderStatus.DELIVERING) {
            throw new RuntimeException("La commande doit être en cours de livraison");
        }

        order.setStatus(Order.OrderStatus.DELIVERED);

        return orderRepository.save(order);
    }

    /**
     * Récupère tous les livreurs
     */
    public List<User> getAllDeliverers() {
        return userRepository.findByRole(User.Role.DELIVERER);
    }
}
