package com.iset.Backend.E_commerce.Repositories;

import com.iset.Backend.E_commerce.Entities.Order;
import com.iset.Backend.E_commerce.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(Order.OrderStatus status);

    List<Order> findByDelivererId(Long delivererId);

    List<Order> findAllByOrderByOrderDateDesc();
}
