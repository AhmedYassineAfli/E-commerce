import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product?: Product;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(p => this.product = p);
  }

  addToCart() {
    if (!this.authService.isCustomer()) {
      // If not logged in or not a customer, redirect to login
      // You might want to check if they are just not logged in vs logged in as admin
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      } else {
        alert('Seuls les clients peuvent ajouter des produits au panier.');
      }
      return;
    }

    if (this.product) {
      this.cartService.addToCart(this.product);
      alert('Produit ajouté au panier !');
    }
  }
}


