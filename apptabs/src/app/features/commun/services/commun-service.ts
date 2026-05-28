import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import depenseCommunCategory from '../models/depenseCommunCategory';

@Injectable({
  providedIn: 'root',
})

export class CommunService {
  constructor(private http: HttpClient) {}

  getDepense() {
    return this.http.get<depenseCommunCategory[]>('api/v1/commun');
  }

  createCategorie(payload: { nom: string; montant: number; notes?: string; couleurs?: string }) {
    return this.http.post<depenseCommunCategory>('api/v1/commun', {
      ...payload,
      courant: 0,
    });
  }

  deleteCategorie(id: string) {
    return this.http.delete(`api/v1/commun/${id}`);
  }

  createDepense(categoryId: string, payload: { nom: string; montant: number; notes?: string }) {
    return this.http.post(`api/v1/commun/${categoryId}/item`, payload);
  }

  deleteDepense(categoryId: string, depenseId: string) {
    return this.http.delete(`api/v1/commun/${categoryId}/item/${depenseId}`);
  }
}
