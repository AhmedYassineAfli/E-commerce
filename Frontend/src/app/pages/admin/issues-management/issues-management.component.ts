import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order';

@Component({
    selector: 'app-issues-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './issues-management.component.html',
    styleUrl: './issues-management.component.css'
})
export class IssuesManagementComponent implements OnInit {
    issues: Order[] = [];
    isLoading: boolean = true;

    constructor(private orderService: OrderService) { }

    ngOnInit() {
        this.loadIssues();
    }

    loadIssues() {
        this.isLoading = true;
        this.orderService.getAllOrders().subscribe({
            next: (orders) => {
                // Filter only reported orders
                this.issues = orders.filter(o => o.reported);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading issues:', error);
                this.isLoading = false;
            }
        });
    }

    openImage(imageUrl: string) {
        const win = window.open();
        if (win) {
            win.document.write(`<img src="${imageUrl}" style="max-width: 100%; height: auto;">`);
        }
    }

    deleteOrder(orderId: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
            this.orderService.cancelOrder(orderId).subscribe({
                next: (response) => {
                    if (response.success) {
                        alert('Commande supprimée avec succès');
                        this.loadIssues();
                    }
                },
                error: (error) => {
                    console.error('Error deleting order:', error);
                    alert('Erreur lors de la suppression de la commande');
                }
            });
        }
    }

    updateOrderStatus(orderId: number, newStatus: string) {
        this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
            next: (response) => {
                if (response.success) {
                    alert('Statut mis à jour avec succès');
                    this.loadIssues();
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
}
