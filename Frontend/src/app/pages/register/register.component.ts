import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    username = '';
    password = '';
    email = '';
    nom = '';
    prenom = '';
    adresse = '';
    telephone = '';
    errorMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/']);
        }
    }

    onSubmit() {
        if (!this.username || !this.password || !this.email || !this.nom || !this.prenom) {
            this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.register({
            username: this.username,
            password: this.password,
            email: this.email,
            nom: this.nom,
            prenom: this.prenom,
            adresse: this.adresse,
            telephone: this.telephone
        }).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                if (response.success) {
                    this.router.navigate(['/']);
                } else {
                    this.errorMessage = response.message || 'Erreur lors de l\'inscription';
                }
            },
            error: (err: any) => {
                this.isLoading = false;
                console.error('Full Register Error:', err);

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    this.errorMessage = err.error.message;
                } else if (typeof err.error === 'string') {
                    this.errorMessage = err.error;
                } else if (err.message) {
                    this.errorMessage = err.message;
                } else {
                    this.errorMessage = 'Une erreur inconnue est survenue';
                }
            }
        });
    }
}
