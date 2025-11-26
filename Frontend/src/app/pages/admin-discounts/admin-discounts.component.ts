import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService, BackendCategory } from '../../services/category.service';
import { Product } from '../../models/product';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-discounts.component.html',
  styleUrl: './admin-discounts.component.css'
})
export class AdminDiscountsComponent implements OnInit {
  products: (Product & { newDiscount?: number })[] = [];
  filteredProducts: (Product & { newDiscount?: number })[] = [];
  categories: { id: number; name: string }[] = [];

  searchQuery: string = '';
  selectedCategory: number | null = null;
  bulkDiscount: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.map(p => ({ ...p, newDiscount: p.discount || 0 }));
        this.filteredProducts = [...this.products];
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits:', err);
        alert('Erreur lors du chargement des produits');
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories.map((c: BackendCategory) => ({
          id: c.idCategory,
          name: c.libelleCat
        }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchQuery ||
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesCategory = !this.selectedCategory ||
        product.category === this.categories.find(c => c.id === this.selectedCategory)?.name;

      return matchesSearch && matchesCategory;
    });
  }

  applyDiscount(product: Product & { newDiscount?: number }) {
    if (product.newDiscount === undefined || product.newDiscount === null) {
      return;
    }

    if (product.newDiscount < 0 || product.newDiscount > 100) {
      alert('La remise doit être entre 0 et 100%');
      return;
    }

    const updateData = {
      discount: product.newDiscount
    };

    this.http.patch(`/api/products/${product.id}/discount`, updateData).subscribe({
      next: (updatedProduct: any) => {
        product.discount = updatedProduct.discount;
        product.newDiscount = updatedProduct.discount;
        alert(`Remise de ${updatedProduct.discount}% appliquée à "${product.name}"`);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        alert('Erreur lors de l\'application de la remise: ' + (err.error?.message || err.message));
      }
    });
  }

  removeDiscount(product: Product & { newDiscount?: number }) {
    const updateData = {
      discount: 0
    };

    this.http.patch(`/api/products/${product.id}/discount`, updateData).subscribe({
      next: (updatedProduct: any) => {
        product.discount = 0;
        product.newDiscount = 0;
        alert(`Remise retirée pour "${product.name}"`);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression de la remise: ' + (err.error?.message || err.message));
      }
    });
  }

  applyBulkDiscount() {
    if (!this.bulkDiscount || this.bulkDiscount < 0 || this.bulkDiscount > 100) {
      alert('La remise doit être entre 0 et 100%');
      return;
    }

    if (!confirm(`Voulez-vous vraiment appliquer une remise de ${this.bulkDiscount}% à ${this.filteredProducts.length} produit(s) ?`)) {
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    const totalProducts = this.filteredProducts.length;

    this.filteredProducts.forEach((product, index) => {
      const updateData = {
        discount: this.bulkDiscount
      };

      this.http.patch(`/api/products/${product.id}/discount`, updateData).subscribe({
        next: (updatedProduct: any) => {
          product.discount = updatedProduct.discount;
          product.newDiscount = updatedProduct.discount;
          successCount++;

          if (index === totalProducts - 1) {
            alert(`Remise appliquée avec succès à ${successCount} produit(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`);
            this.bulkDiscount = null;
          }
        },
        error: (err) => {
          console.error('Erreur:', err);
          errorCount++;

          if (index === totalProducts - 1) {
            alert(`Remise appliquée à ${successCount} produit(s), ${errorCount} erreur(s)`);
            this.bulkDiscount = null;
          }
        }
      });
    });
  }
}
