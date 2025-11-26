import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = true;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.orderService.getOrdersByUser(user.id).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.isLoading = false;
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'CONFIRMED': 'Confirmée',
      'PROCESSING': 'En traitement',
      'SHIPPED': 'Expédiée',
      'DELIVERED': 'Livrée',
      'CANCELLED': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'CASH_ON_DELIVERY': 'Paiement à la livraison',
      'CREDIT_CARD': 'Carte bancaire',
      'PAYPAL': 'PayPal'
    };
    return labels[method] || method;
  }

  cancelOrder(orderId: number) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Commande annulée avec succès');
            this.loadOrders();
          }
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Erreur lors de l\'annulation de la commande');
        }
      });
    }
  }

  canCancelOrder(status: string): boolean {
    return status === 'PENDING' || status === 'CONFIRMED';
  }

  canReportOrder(order: Order): boolean {
    return order.status === 'DELIVERED' && !order.reported;
  }

  reportOrder(orderId: number) {
    this.router.navigate(['/report-issue', orderId]);
  }
}
