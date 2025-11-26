import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DelivererService, Deliverer } from '../../../services/deliverer.service';

interface DelivererForm {
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
}

@Component({
  selector: 'app-deliverers-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deliverers-management.component.html',
  styleUrl: './deliverers-management.component.css'
})
export class DeliverersManagementComponent implements OnInit {
  deliverers: Deliverer[] = [];
  loading = false;
  showModal = false;
  isEditMode = false;
  selectedDeliverer: Deliverer | null = null;

  delivererForm: DelivererForm = {
    username: '',
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    adresse: ''
  };

  constructor(
    private delivererService: DelivererService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadDeliverers();
  }

  loadDeliverers() {
    this.loading = true;
    this.delivererService.getAllDeliverers().subscribe({
      next: (deliverers) => {
        this.deliverers = deliverers;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement livreurs:', err);
        this.loading = false;
        alert('Erreur lors du chargement des livreurs');
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedDeliverer = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(deliverer: Deliverer) {
    this.isEditMode = true;
    this.selectedDeliverer = deliverer;
    this.delivererForm = {
      username: deliverer.username,
      email: deliverer.email,
      password: '', // Ne pas pré-remplir le mot de passe
      nom: deliverer.nom,
      prenom: deliverer.prenom,
      telephone: deliverer.telephone,
      adresse: deliverer.adresse
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.delivererForm = {
      username: '',
      email: '',
      password: '',
      nom: '',
      prenom: '',
      telephone: '',
      adresse: ''
    };
  }

  createDeliverer() {
    if (!this.validateForm()) {
      return;
    }

    const payload = {
      ...this.delivererForm,
      role: 'DELIVERER'
    };

    this.http.post('http://localhost:8082/auth/register', payload).subscribe({
      next: () => {
        alert('Livreur créé avec succès !');
        this.closeModal();
        this.loadDeliverers();
      },
      error: (err) => {
        console.error('Erreur création livreur:', err);
        const msg = err?.error?.message || `Erreur lors de la création du livreur (status ${err?.status ?? '0'})`;
        alert(msg);
      }
    });
  }

  updateDeliverer() {
    if (!this.selectedDeliverer) return;

    const payload = {
      ...this.delivererForm,
      id: this.selectedDeliverer.id,
      role: 'DELIVERER'
    };

    this.http.put(`http://localhost:8082/api/users/${this.selectedDeliverer.id}`, payload).subscribe({
      next: () => {
        alert('Livreur modifié avec succès !');
        this.closeModal();
        this.loadDeliverers();
      },
      error: (err) => {
        console.error('Erreur modification livreur:', err);
        const msg = err?.error?.message || `Erreur lors de la modification du livreur (status ${err?.status ?? '0'})`;
        alert(msg);
      }
    });
  }

  deleteDeliverer(deliverer: Deliverer) {
    if (confirm(`Voulez-vous vraiment supprimer le livreur ${deliverer.prenom} ${deliverer.nom} ?`)) {
      this.http.delete(`http://localhost:8082/api/users/${deliverer.id}`).subscribe({
        next: () => {
          alert('Livreur supprimé avec succès !');
          this.loadDeliverers();
        },
        error: (err) => {
          console.error('Erreur suppression livreur:', err);
          const msg = err?.error?.message || `Erreur lors de la suppression du livreur (status ${err?.status ?? '0'})`;
          alert(msg);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.delivererForm.username || !this.delivererForm.email ||
      !this.delivererForm.nom || !this.delivererForm.prenom) {
      alert('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    if (!this.isEditMode && !this.delivererForm.password) {
      alert('Le mot de passe est obligatoire');
      return false;
    }

    return true;
  }

  submitForm() {
    if (this.isEditMode) {
      this.updateDeliverer();
    } else {
      this.createDeliverer();
    }
  }
}
