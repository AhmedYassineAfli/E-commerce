import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../models/order';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:8082/api/orders';

    constructor(private http: HttpClient) { }

    createOrder(orderRequest: CreateOrderRequest): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create`, orderRequest);
    }

    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/all`);
    }

    getOrdersByUser(userId: number): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
    }

    getOrderById(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
    }

    getOrdersByStatus(status: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
    }

    updateOrderStatus(orderId: number, status: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${orderId}/status`, { status });
    }

    cancelOrder(orderId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${orderId}/cancel`);
    }

    reportOrder(orderId: number, reason: string, image: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${orderId}/report`, { reason, image });
    }
}
