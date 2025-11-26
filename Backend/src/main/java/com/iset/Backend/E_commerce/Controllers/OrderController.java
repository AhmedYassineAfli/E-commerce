package com.iset.Backend.E_commerce.Controllers;

import com.iset.Backend.E_commerce.Entities.Order;
import com.iset.Backend.E_commerce.Services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            System.out.println("=== Order Creation Request ===");
            System.out.println("User ID: " + request.getUserId());
            System.out.println("Items count: " + (request.getItems() != null ? request.getItems().size() : "null"));
            System.out.println("Order Info: " + request.getOrderInfo());

            Order order = orderService.createOrder(
                    request.getUserId(),
                    request.getItems(),
                    request.getOrderInfo());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Commande créée avec succès");
            response.put("orderId", order.getId());
            response.put("order", order);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Print full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la création de la commande: " + e.getMessage());
            errorResponse.put("error", e.getClass().getName());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        try {
            Order.OrderStatus orderStatus = Enum.valueOf(Order.OrderStatus.class, status.toUpperCase());
            return ResponseEntity.ok(orderService.getOrdersByStatus(orderStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {
        try {
            String statusStr = request.get("status");
            Order.OrderStatus newStatus = Enum.valueOf(Order.OrderStatus.class, statusStr.toUpperCase());
            Order updatedOrder = orderService.updateOrderStatus(orderId, newStatus);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statut de la commande mis à jour");
            response.put("order", updatedOrder);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        try {
            orderService.cancelOrder(orderId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Commande annulée avec succès");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/{orderId}/report")
    public ResponseEntity<?> reportOrder(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            String image = request.get("image");
            Order order = orderService.reportDeliveryIssue(orderId, reason, image);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Problème signalé avec succès");
            response.put("order", order);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Request DTO
    public static class CreateOrderRequest {
        private Long userId;
        private List<OrderService.OrderItemDTO> items;
        private OrderService.OrderDTO orderInfo;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public List<OrderService.OrderItemDTO> getItems() {
            return items;
        }

        public void setItems(List<OrderService.OrderItemDTO> items) {
            this.items = items;
        }

        public OrderService.OrderDTO getOrderInfo() {
            return orderInfo;
        }

        public void setOrderInfo(OrderService.OrderDTO orderInfo) {
            this.orderInfo = orderInfo;
        }
    }
}
