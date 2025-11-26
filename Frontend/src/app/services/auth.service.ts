import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER' | 'DELIVERER';
  nom: string;
  prenom: string;
  adresse?: string;
  telephone?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  nom: string;
  prenom: string;
  adresse?: string;
  telephone?: string;
  role?: 'ADMIN' | 'CUSTOMER' | 'DELIVERER'; // Optional role for registration, backend might assign default
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.setStoredUser(response.user);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE}/register`, data).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.setStoredUser(response.user);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    this.clearStoredUser();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'ADMIN';
  }

  isCustomer(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'CUSTOMER';
  }

  isDeliverer(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'DELIVERER';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setStoredUser(user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private getStoredUser(): User | null {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  private clearStoredUser(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
}
