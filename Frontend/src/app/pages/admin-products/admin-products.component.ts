import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService, BackendCategory } from '../../services/category.service';
import { DealerService, BackendDealer } from '../../services/dealer.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: BackendCategory[] = [];
  dealers: BackendDealer[] = [];

  showModal = false;
  isEditing = false;
  selectedProduct: Product | null = null;

  // Formulaire
  formData = {
    designation: '',
    description: '',
    price: 0,
    quantiteEnstock: 0,
    imageUrl: '',
    categoryId: 0,
    dealerId: 0,
    date: new Date().toISOString().split('T')[0]
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dealerService: DealerService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadDealers();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits:', err);
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    });
  }

  loadDealers() {
    this.dealerService.getAll().subscribe({
      next: (dealers) => {
        this.dealers = dealers;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des vendeurs:', err);
      }
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.selectedProduct = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.isEditing = true;
    this.selectedProduct = product;

    // Récupérer le produit complet depuis le backend pour avoir toutes les infos (dealer, etc.)
    this.productService.getProductRaw(product.id).subscribe({
      next: (backendProduct: any) => {
        this.formData = {
          designation: product.name,
          description: product.description,
          price: product.price,
          quantiteEnstock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: this.getCategoryIdByName(product.category),
          dealerId: backendProduct?.dealer?.idfor || backendProduct?.dealer?.idDealer || 0,
          date: backendProduct?.date ? new Date(backendProduct.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
      },
      error: () => {
        // Fallback si l'API ne retourne pas les infos complètes
        this.formData = {
          designation: product.name,
          description: product.description,
          price: product.price,
          quantiteEnstock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: this.getCategoryIdByName(product.category),
          dealerId: 0,
          date: new Date().toISOString().split('T')[0]
        };
      }
    });

    this.showModal = true;
  }

  getCategoryIdByName(categoryName: string): number {
    const category = this.categories.find(c => c.libelleCat === categoryName);
    return category ? category.idCategory : 0;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      designation: '',
      description: '',
      price: 0,
      quantiteEnstock: 0,
      imageUrl: '',
      categoryId: 0,
      dealerId: 0,
      date: new Date().toISOString().split('T')[0]
    };
  }

  saveProduct() {
    if (!this.validateForm()) {
      return;
    }

    const productData = {
      designation: this.formData.designation,
      description: this.formData.description,
      price: this.formData.price,
      quantiteEnstock: this.formData.quantiteEnstock,
      imageUrl: this.formData.imageUrl || undefined,
      categoryId: this.formData.categoryId,
      dealerId: this.formData.dealerId || (this.dealers.length > 0 ? (this.dealers[0].idfor || this.dealers[0].idDealer) : null),
      date: new Date(this.formData.date)
    };

    if (this.isEditing && this.selectedProduct) {
      // Update
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du produit:', err);
          alert('Erreur lors de la mise à jour du produit');
        }
      });
    } else {
      // Create
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la création du produit:', err);
          alert('Erreur lors de la création du produit');
        }
      });
    }
  }

  deleteProduct(product: Product) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du produit:', err);
        alert('Erreur lors de la suppression du produit');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert('L\'image est trop volumineuse. Veuillez choisir une image de moins de 1 Mo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  validateForm(): boolean {
    if (!this.formData.designation.trim()) {
      alert('Veuillez entrer une désignation');
      return false;
    }
    if (this.formData.price <= 0) {
      alert('Le prix doit être supérieur à 0');
      return false;
    }
    if (this.formData.quantiteEnstock < 0) {
      alert('La quantité en stock ne peut pas être négative');
      return false;
    }
    if (!this.formData.categoryId) {
      alert('Veuillez sélectionner une catégorie');
      return false;
    }

    return true;
  }
}

