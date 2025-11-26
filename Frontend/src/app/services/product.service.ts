import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable, catchError, map, of } from 'rxjs';

// shape as returned by Spring Boot (db columns)
type BackendProduct = {
  idPro?: number;           // as exposed by getIdPro()
  idProduct?: number;       // fallback if using field name strategy
  designation: string;
  description: string;
  price: number;
  quantiteEnstock: number;
  imageUrl?: string;
  category?: any;
  dealer?: any;
  rating?: number;
  discount?: number;        // Pourcentage de remise (0-100)
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Use Angular dev proxy: /api -> http://localhost:8080 (see proxy.conf.json)
  private readonly API_BASE = '/api';

  // Fallback mock data if API not available
  private readonly fallback: Product[] = [];

  constructor(private readonly http: HttpClient) { }

  private mapFromBackend(b: BackendProduct): Product {
    return {
      id: (b.idPro ?? b.idProduct) as number,
      name: b.designation,
      description: b.description ?? '',
      price: Number(b.price ?? 0),
      imageUrl: b.imageUrl || `https://picsum.photos/seed/p${(b.idPro ?? b.idProduct)}/1200/800`,
      category: (b.category && (b.category as any).libelleCat) ? String((b.category as any).libelleCat) : '',
      rating: Number((b as any).rating ?? 4.3),
      stock: Number(b.quantiteEnstock ?? (b as any).quantite_enstock ?? 0),
      discount: b.discount ?? 0
    };
  }

  getProducts(categoryId?: number): Observable<Product[]> {
    const url = categoryId != null ? `${this.API_BASE}/products?categoryId=${categoryId}` : `${this.API_BASE}/products`;
    return this.http.get<BackendProduct[]>(url).pipe(
      map(rows => rows.map(r => this.mapFromBackend(r))),
      catchError(() => of(this.fallback))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<BackendProduct>(`${this.API_BASE}/products/${id}`).pipe(
      map(r => this.mapFromBackend(r)),
      catchError(() => of(this.fallback.find(p => p.id === id)))
    );
  }

  createProduct(product: Partial<BackendProduct>): Observable<Product> {
    return this.http.post<BackendProduct>(`${this.API_BASE}/products`, product).pipe(
      map(r => this.mapFromBackend(r))
    );
  }

  updateProduct(id: number, product: Partial<BackendProduct>): Observable<Product> {
    return this.http.put<BackendProduct>(`${this.API_BASE}/products/${id}`, product).pipe(
      map(r => this.mapFromBackend(r))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/products/${id}`);
  }

  // Récupérer le produit brut depuis le backend (avec toutes les infos du dealer)
  getProductRaw(id: number): Observable<BackendProduct> {
    return this.http.get<BackendProduct>(`${this.API_BASE}/products/${id}`);
  }
}


