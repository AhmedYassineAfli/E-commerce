import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    total: number = 0;

    constructor(
        public cartService: CartService,
        private router: Router
    ) { }

    ngOnInit() {
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
            this.total = this.cartService.getCartTotal();
        });
    }

    updateQuantity(productId: number, quantity: number) {
        this.cartService.updateQuantity(productId, quantity);
    }

    removeItem(productId: number) {
        if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
            this.cartService.removeFromCart(productId);
        }
    }

    clearCart() {
        if (confirm('Voulez-vous vraiment vider le panier ?')) {
            this.cartService.clearCart();
        }
    }

    checkout() {
        // Vérifier si l'utilisateur est connecté
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Veuillez vous connecter pour passer une commande');
            this.router.navigate(['/login']);
            return;
        }
        this.router.navigate(['/checkout']);
    }
}
