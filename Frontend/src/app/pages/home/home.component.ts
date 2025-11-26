import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService, BackendCategory } from '../../services/category.service';
import { Product } from '../../models/product';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories: { id: number; name: string }[] = [];
  featured: Product[] = [];
  email: string = '';
  selectedProduct: Product | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly router: Router
  ) {
    this.categoryService.getAll().subscribe(rows => {
      this.categories = rows.slice(0, 6).map((c: BackendCategory) => ({ id: c.idCategory, name: c.libelleCat }));
    });
    this.productService.getProducts().subscribe(items => {
      this.featured = items.slice(0, 6);
    });
  }

  ngOnInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }

  addToCart(product: Product) {
    if (!this.authService.isCustomer()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product, 1);
    this.closeQuickView();
    alert(`${product.name} ajouté au panier !`);
  }

  subscribeNewsletter() {
    if (this.email) {
      console.log('Inscription à la newsletter avec:', this.email);
      alert(`Merci pour votre inscription à notre newsletter avec l'email: ${this.email}`);
      this.email = '';
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.opacity = '1';
  }

  quickView(product: Product) {
    this.selectedProduct = product;
  }

  closeQuickView() {
    this.selectedProduct = null;
  }
}
