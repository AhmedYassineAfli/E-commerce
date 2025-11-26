import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Si déjà connecté, rediriger selon le rôle
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user?.role === 'ADMIN') {
        this.router.navigate(['admin']);
      } else if (user?.role === 'DELIVERER') {
        this.router.navigate(['deliverer']);
      } else {
        this.router.navigate(['']);
      }
    }
  }

  onSubmit() {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.user) {
          // Redirection selon le rôle
          if (response.user.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (response.user.role === 'DELIVERER') {
            this.router.navigate(['/deliverer']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.errorMessage = response.message || 'Identifiants incorrects';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
        console.error('Login error:', err);
      }
    });
  }
}

