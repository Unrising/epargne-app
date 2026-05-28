import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Salaire } from '../models/salaire';

@Injectable({
  providedIn: 'root',
})
export class SalaireService {
  constructor(private http: HttpClient) {}

  getSalaires() {
    return this.http.get<Salaire[]>('api/v1/salaire');
  }

  createSalaire(payload: { nom: string; montant: number; mois: string; notes?: string }) {
    return this.http.post<Salaire>('api/v1/salaire', payload);
  }

  deleteSalaire(id: string) {
    return this.http.delete(`api/v1/salaire/${id}`);
  }
}
