import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  currentRoute = '';

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {
    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  ngOnInit() {
    // Initialiser la route actuelle
    this.currentRoute = this.router.url;
    // Vérifier l'état d'authentification au chargement
    this.authService.currentUser$.subscribe();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isLoginPage(): boolean {
    return this.currentRoute === '/login' || this.currentRoute === '/register';
  }

  isProductsPage(): boolean {
    return this.currentRoute.startsWith('/products');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getCartItemCount(): number {
    return this.cartService.getCartItemCount();
  }
}
