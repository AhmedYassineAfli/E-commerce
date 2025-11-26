import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';

@Component({
    selector: 'app-report-issue',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './report-issue.component.html',
    styleUrl: './report-issue.component.css'
})
export class ReportIssueComponent implements OnInit {
    order: Order | null = null;
    isLoading: boolean = true;
    reason: string = '';
    description: string = '';
    selectedImage: string | null = null;
    isSubmitting: boolean = false;

    reasons = [
        'Commande non reçue',
        'Article incorrect/non conforme',
        'Article endommagé',
        'Article manquant'
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService
    ) { }

    ngOnInit() {
        const orderId = this.route.snapshot.paramMap.get('id');
        if (orderId) {
            this.loadOrder(Number(orderId));
        }
    }

    loadOrder(id: number) {
        // Note: Ideally we should have a getOrderById method, but for now we filter from all orders
        // or we can implement getOrderById in backend. 
        // Let's try to find it from user's orders for security
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.orderService.getOrdersByUser(user.id).subscribe({
                next: (orders) => {
                    this.order = orders.find(o => o.id === id) || null;
                    this.isLoading = false;
                    if (!this.order) {
                        alert('Commande introuvable');
                        this.router.navigate(['/my-orders']);
                    }
                },
                error: (error) => {
                    console.error('Error loading order:', error);
                    this.isLoading = false;
                }
            });
        }
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit() {
        if (!this.reason || !this.description || !this.selectedImage) {
            alert('Veuillez remplir tous les champs et ajouter une photo');
            return;
        }

        if (this.order) {
            this.isSubmitting = true;
            const fullReason = `${this.reason}: ${this.description}`;

            this.orderService.reportOrder(this.order.id!, fullReason, this.selectedImage).subscribe({
                next: (response) => {
                    if (response.success) {
                        alert('Signalement envoyé avec succès !');
                        this.router.navigate(['/my-orders']);
                    }
                },
                error: (error) => {
                    console.error('Error reporting order:', error);
                    alert('Erreur lors de l\'envoi du signalement');
                    this.isSubmitting = false;
                }
            });
        }
    }
}
