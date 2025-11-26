import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
    id: number;
    user: any;
    deliverer?: any;
    orderItems: any[];
    totalAmount: number;
    status: string;
    paymentMethod: string;
    orderDate: string;
    deliveryAddress: string;
    deliveryPhone: string;
    deliveryName: string;
    notes?: string;
}

export interface Deliverer {
    id: number;
    username: string;
    email: string;
    nom: string;
    prenom: string;
    telephone: string;
    adresse: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class DelivererService {
    private apiUrl = 'http://localhost:8082/api/deliverer';

    constructor(private http: HttpClient) { }

    /**
     * Récupère toutes les commandes confirmées (disponibles pour assignation)
     */
    getAvailableOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/available`);
    }

    /**
     * Récupère les commandes assignées à un livreur
     */
    getDelivererOrders(delivererId: number): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/${delivererId}`);
    }

    /**
     * Assigne une commande à un livreur
     */
    assignOrder(orderId: number, delivererId: number): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/assign/${orderId}/${delivererId}`, {});
    }

    /**
     * Démarre la livraison
     */
    startDelivery(orderId: number, delivererId: number): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/start/${orderId}/${delivererId}`, {});
    }

    /**
     * Confirme la livraison (check-in)
     */
    confirmDelivery(orderId: number, delivererId: number): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/confirm/${orderId}/${delivererId}`, {});
    }

    /**
     * Récupère tous les livreurs
     */
    getAllDeliverers(): Observable<Deliverer[]> {
        return this.http.get<Deliverer[]>(`${this.apiUrl}/all`);
    }
}
