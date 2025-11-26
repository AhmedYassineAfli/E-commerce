import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CreateOrderRequest, PaymentMethod } from '../../models/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  isLoading: boolean = false;

  // Informations de livraison
  deliveryInfo = {
    name: '',
    phone: '',
    address: '',
    notes: ''
  };

  paymentMethod: string = 'CASH_ON_DELIVERY';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal();
    });

    // Charger les informations de l'utilisateur depuis localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.deliveryInfo.name = `${user.prenom || ''} ${user.nom || ''}`.trim();
      this.deliveryInfo.phone = user.telephone || '';
      this.deliveryInfo.address = user.adresse || '';
    }
  }

  placeOrder() {
    if (!this.validateForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Veuillez vous connecter pour passer une commande');
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userStr);
    this.isLoading = true;

    console.log('Cart items:', this.cartItems);
    console.log('User:', user);

    const orderRequest: CreateOrderRequest = {
      userId: user.id,
      items: this.cartItems.map(item => {
        console.log('Product:', item.product);
        console.log('Product ID:', item.product.id);
        return {
          productId: item.product.id,
          quantity: item.quantity
        };
      }),
      orderInfo: {
        paymentMethod: this.paymentMethod,
        deliveryAddress: this.deliveryInfo.address,
        deliveryPhone: this.deliveryInfo.phone,
        deliveryName: this.deliveryInfo.name,
        notes: this.deliveryInfo.notes
      }
    };

    console.log('Order Request:', JSON.stringify(orderRequest, null, 2));

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          alert('Commande passée avec succès ! Numéro de commande: ' + response.orderId);
          this.cartService.clearCart();
          this.router.navigate(['/my-orders']);
        } else {
          alert('Erreur: ' + response.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating order:', error);
        console.error('Error response:', error.error);
        alert('Erreur lors de la création de la commande. Veuillez réessayer.');
      }
    });
  }

  validateForm(): boolean {
    return this.deliveryInfo.name.trim() !== '' &&
      this.deliveryInfo.phone.trim() !== '' &&
      this.deliveryInfo.address.trim() !== '';
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}
