import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = new BehaviorSubject<CartItem[]>(this.getStoredCart());
    public cartItems$ = this.cartItems.asObservable();

    constructor() { }

    addToCart(product: Product, quantity: number = 1): void {
        const currentCart = this.cartItems.value;
        const existingItem = currentCart.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            currentCart.push({ product, quantity });
        }

        this.cartItems.next(currentCart);
        this.saveCart(currentCart);
    }

    removeFromCart(productId: number): void {
        const currentCart = this.cartItems.value.filter(item => item.product.id !== productId);
        this.cartItems.next(currentCart);
        this.saveCart(currentCart);
    }

    updateQuantity(productId: number, quantity: number): void {
        const currentCart = this.cartItems.value;
        const item = currentCart.find(item => item.product.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.cartItems.next(currentCart);
                this.saveCart(currentCart);
            }
        }
    }

    clearCart(): void {
        this.cartItems.next([]);
        this.saveCart([]);
    }

    getCartItemCount(): number {
        return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal(): number {
        return this.cartItems.value.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    private saveCart(cart: CartItem[]): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    private getStoredCart(): CartItem[] {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('cart');
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    }
}
