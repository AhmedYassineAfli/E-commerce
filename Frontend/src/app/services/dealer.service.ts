import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type BackendDealer = {
  idfor?: number;
  idDealer?: number;
  email: string;
  adresse: string;
  numTel: string;
};

@Injectable({ providedIn: 'root' })
export class DealerService {
  private readonly API_BASE = '/api/dealers';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<BackendDealer[]> {
    return this.http.get<BackendDealer[]>(this.API_BASE);
  }

  create(dealer: Partial<BackendDealer>): Observable<BackendDealer> {
    return this.http.post<BackendDealer>(this.API_BASE, dealer);
  }
}

