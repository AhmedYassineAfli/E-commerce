import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService, BackendCategory } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product';
import AOS from 'aos';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  query = '';
  selectedCategoryId: number | null = null;
  sortKey: 'name' | 'price' | 'price-desc' | 'rating' = 'name';
  categoryOptions: { id: number; name: string }[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.productService.getProducts().subscribe({
      next: (items) => { this.products = items; },
      error: () => { this.products = []; }
    });

    this.categoryService.getAll().subscribe({
      next: (rows: BackendCategory[]) => {
        this.categoryOptions = rows.map(r => ({ id: r.idCategory, name: r.libelleCat }));
      }
    });
  }

  addToCart(product: Product) {
    if (!this.authService.isCustomer()) {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      } else {
        alert('Seuls les clients peuvent ajouter des produits au panier.');
      }
      return;
    }

    this.cartService.addToCart(product);
    alert('Produit ajouté au panier !');
  }

  ngOnInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });

    // Lire le paramètre categoryId depuis l'URL
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategoryId = Number(params['categoryId']);
        this.onCategoryChange();
      }
    });
  }

  onCategoryChange() {
    this.productService.getProducts(this.selectedCategoryId ?? undefined).subscribe({
      next: (items) => { this.products = items; },
      error: () => { this.products = []; }
    });
  }

  filtered(): Product[] {
    const q = this.query.toLowerCase().trim();
    const catName = this.categoryOptions.find(c => c.id === this.selectedCategoryId)?.name;
    const key = this.sortKey;

    let filtered = this.products.filter(p => {
      const matchesQuery = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchesCategory = !catName || p.category === String(catName);

      return matchesQuery && matchesCategory;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      if (key === 'price') {
        return a.price - b.price; // Prix croissant
      } else if (key === 'price-desc') {
        return b.price - a.price; // Prix décroissant
      } else if (key === 'rating') {
        return (a.rating || 0) - (b.rating || 0);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }
}


