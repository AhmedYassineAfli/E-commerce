import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type BackendCategory = {
  idCategory: number;
  libelleCat: string;
};

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API_BASE = '/api/categories';

  constructor(private readonly http: HttpClient) { }

  getAll(): Observable<BackendCategory[]> {
    return this.http.get<BackendCategory[]>(this.API_BASE);
  }

  create(category: { libelleCat: string }): Observable<BackendCategory> {
    return this.http.post<BackendCategory>(this.API_BASE, category);
  }

  update(id: number, category: { libelleCat: string }): Observable<BackendCategory> {
    return this.http.put<BackendCategory>(`${this.API_BASE}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/${id}`);
  }
}


