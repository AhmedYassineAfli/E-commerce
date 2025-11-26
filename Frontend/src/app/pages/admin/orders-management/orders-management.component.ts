import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.css'
})
export class OrdersManagementComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading: boolean = true;
  selectedStatus: string = 'ALL';
  searchTerm: string = '';

  statusOptions = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'CONFIRMED', label: 'Confirmées' },
    { value: 'PROCESSING', label: 'En traitement' },
    { value: 'SHIPPED', label: 'Expédiées' },
    { value: 'DELIVERED', label: 'Livrées' },
    { value: 'CANCELLED', label: 'Annulées' }
  ];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filterOrders();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = this.selectedStatus === 'ALL' || order.status === this.selectedStatus;
      const matchesSearch = !this.searchTerm ||
        order.id?.toString().includes(this.searchTerm) ||
        order.deliveryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.deliveryPhone.includes(this.searchTerm);
      return matchesStatus && matchesSearch;
    });
  }

  onStatusFilterChange() {
    this.filterOrders();
  }

  onSearchChange() {
    this.filterOrders();
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Statut mis à jour avec succès');
          this.loadOrders();
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
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

  getTotalRevenue(): number {
    return this.filteredOrders
      .filter(order => order.status !== 'CANCELLED')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }

  getOrdersCount(status?: string): number {
    if (status) {
      return this.orders.filter(order => order.status === status).length;
    }
    return this.orders.length;
  }

  getReportedCount(): number {
    return this.orders.filter(o => o.reported).length;
  }

  openImage(imageUrl: string) {
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${imageUrl}" style="max-width: 100%; height: auto;">`);
    }
  }
}
