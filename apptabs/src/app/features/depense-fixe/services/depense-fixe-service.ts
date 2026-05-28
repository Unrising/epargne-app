import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DepenseFixe } from '../models/depense-fixe';

@Injectable({
  providedIn: 'root',
})
export class DepenseFixeService {
  constructor(private http: HttpClient) {}

  getDepensesFixes() {
    return this.http.get<DepenseFixe[]>('api/v1/depense-fixe');
  }

  createDepenseFixe(payload: { nom: string; montant: number; jour: number; notes?: string }) {
    return this.http.post<DepenseFixe>('api/v1/depense-fixe', payload);
  }

  deleteDepenseFixe(id: string) {
    return this.http.delete(`api/v1/depense-fixe/${id}`);
  }
}
