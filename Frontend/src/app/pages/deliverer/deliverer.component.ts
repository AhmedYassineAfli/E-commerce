import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelivererService, Order } from '../../services/deliverer.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deliverer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deliverer.component.html',
  styleUrl: './deliverer.component.css'
})
export class DelivererComponent implements OnInit {
  availableOrders: Order[] = [];
  myOrders: Order[] = [];
  delivererId: number = 0;
  loading = false;

  constructor(
    private delivererService: DelivererService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Vérifier si l'utilisateur est un livreur
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'DELIVERER') {
      this.router.navigate(['/login']);
      return;
    }

    this.delivererId = user.id;
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    // Charger les commandes disponibles
    this.delivererService.getAvailableOrders().subscribe({
      next: (orders) => {
        this.availableOrders = orders;
      },
      error: (err) => console.error('Erreur chargement commandes disponibles:', err)
    });

    // Charger mes commandes
    this.delivererService.getDelivererOrders(this.delivererId).subscribe({
      next: (orders) => {
        this.myOrders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement mes commandes:', err);
        this.loading = false;
      }
    });
  }

  acceptOrder(orderId: number) {
    if (confirm('Voulez-vous accepter cette commande ?')) {
      this.delivererService.assignOrder(orderId, this.delivererId).subscribe({
        next: () => {
          alert('Commande acceptée avec succès !');
          this.loadOrders();
        },
        error: (err) => {
          console.error('Erreur lors de l\'acceptation:', err);
          const msg = err?.error?.message || `Erreur lors de l'acceptation de la commande (status ${err?.status ?? '0'})`;
          alert(msg);
        }
      });
    }
  }

  startDelivery(orderId: number) {
    if (confirm('Commencer la livraison ?')) {
      this.delivererService.startDelivery(orderId, this.delivererId).subscribe({
        next: () => {
          alert('Livraison démarrée !');
          this.loadOrders();
        },
        error: (err) => {
          console.error('Erreur lors du démarrage:', err);
          const msg = err?.error?.message || `Erreur lors du démarrage de la livraison (status ${err?.status ?? '0'})`;
          alert(msg);
        }
      });
    }
  }

  confirmDelivery(orderId: number) {
    if (confirm('Confirmer la livraison ? (Check-in)')) {
      this.delivererService.confirmDelivery(orderId, this.delivererId).subscribe({
        next: () => {
          alert('Livraison confirmée avec succès !');
          this.loadOrders();
        },
        error: (err) => {
          console.error('Erreur lors de la confirmation:', err);
          const msg = err?.error?.message || `Erreur lors de la confirmation de la livraison (status ${err?.status ?? '0'})`;
          alert(msg);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'badge-confirmed';
      case 'ASSIGNED': return 'badge-assigned';
      case 'DELIVERING': return 'badge-delivering';
      case 'DELIVERED': return 'badge-delivered';
      default: return 'badge-default';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Confirmée';
      case 'ASSIGNED': return 'Assignée';
      case 'DELIVERING': return 'En livraison';
      case 'DELIVERED': return 'Livrée';
      default: return status;
    }
  }
}
