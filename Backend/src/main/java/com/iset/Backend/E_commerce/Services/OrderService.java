package com.iset.Backend.E_commerce.Services;

import com.iset.Backend.E_commerce.Entities.*;
import com.iset.Backend.E_commerce.Repositories.OrderRepository;
import com.iset.Backend.E_commerce.Repositories.ProductRepositories;
import com.iset.Backend.E_commerce.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepositories productRepository;

    @Transactional
    public Order createOrder(Long userId, List<OrderItemDTO> items, OrderDTO orderDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setPaymentMethod(Order.PaymentMethod.valueOf(orderDTO.getPaymentMethod()));
        order.setDeliveryAddress(orderDTO.getDeliveryAddress());
        order.setDeliveryPhone(orderDTO.getDeliveryPhone());
        order.setDeliveryName(orderDTO.getDeliveryName());
        order.setNotes(orderDTO.getNotes());
        order.setStatus(Order.OrderStatus.PENDING);

        double totalAmount = 0.0;

        for (OrderItemDTO itemDTO : items) {
            Products product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            // Vérifier le stock
            if (product.getQuantiteEnstock() < itemDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getDesignation());
            }

            // Calculer le prix avec remise si applicable
            double price = product.getPrice();
            if (product.getDiscount() != null && product.getDiscount() > 0) {
                price = price * (1 - product.getDiscount() / 100.0);
            }

            OrderItem orderItem = new OrderItem(product, itemDTO.getQuantity(), price);
            order.addOrderItem(orderItem);

            totalAmount += orderItem.getSubtotal();

            // Mettre à jour le stock
            product.setQuantiteEnstock(product.getQuantiteEnstock() - itemDTO.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        for (OrderItem item : order.getOrderItems()) {
            Products product = item.getProduct();
            product.setQuantiteEnstock(product.getQuantiteEnstock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Transactional
    public Order reportDeliveryIssue(Long orderId, String reason, String image) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Vérifier que la commande est marquée comme livrée
        if (order.getStatus() != Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Only delivered orders can be reported");
        }

        // Vérifier si déjà signalée
        if (order.getReported()) {
            throw new RuntimeException("This order has already been reported");
        }

        order.setReported(true);

        Signal signal = new Signal();
        signal.setReason(reason);
        signal.setImage(image);
        signal.setReportDate(java.time.LocalDateTime.now());
        signal.setOrder(order);

        order.setSignal(signal);

        return orderRepository.save(order);
    }

    public List<Order> getReportedOrders() {
        return orderRepository.findAll().stream()
                .filter(Order::getReported)
                .toList();
    }

    // DTOs
    public static class OrderDTO {
        private String paymentMethod;
        private String deliveryAddress;
        private String deliveryPhone;
        private String deliveryName;
        private String notes;

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public String getDeliveryAddress() {
            return deliveryAddress;
        }

        public void setDeliveryAddress(String deliveryAddress) {
            this.deliveryAddress = deliveryAddress;
        }

        public String getDeliveryPhone() {
            return deliveryPhone;
        }

        public void setDeliveryPhone(String deliveryPhone) {
            this.deliveryPhone = deliveryPhone;
        }

        public String getDeliveryName() {
            return deliveryName;
        }

        public void setDeliveryName(String deliveryName) {
            this.deliveryName = deliveryName;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
