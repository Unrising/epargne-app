import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import depenseCategory from '../models/depenseCategory';

@Injectable({
  providedIn: 'root',
})

export class CourantService {
  constructor(private http: HttpClient) {}

  getDepense() {
    return this.http.get<depenseCategory[]>('api/v1/depense');
  }

  createCategorie(payload: { nom: string; montant: number; notes?: string; couleurs?: string }) {
    return this.http.post<depenseCategory>('api/v1/depense', {
      ...payload,
      courant: 0,
    });
  }

  deleteCategorie(id: string) {
    return this.http.delete(`api/v1/depense/${id}`);
  }

  createDepense(categoryId: string, payload: { nom: string; montant: number; notes?: string }) {
    return this.http.post(`api/v1/depense/${categoryId}/item`, payload);
  }

  deleteDepense(categoryId: string, depenseId: string) {
    return this.http.delete(`api/v1/depense/${categoryId}/item/${depenseId}`);
  }
}
