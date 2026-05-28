import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { epargne } from '../models/epargne';

@Injectable({
  providedIn: 'root',
})

export class EpargneService {
  constructor(private http: HttpClient) {}

  getCategorie() {
    return this.http.get<epargne[]>('api/v1/epargne');
  }

  createCategorie(payload: { nom: string; montant: number; notes?: string; couleurs?: string }) {
    return this.http.post<epargne>('api/v1/epargne', {
      ...payload,
      courant: 0,
    });
  }

  deleteCategorie(id: string) {
    return this.http.delete(`api/v1/epargne/${id}`);
  }

  createEconomie(epargneId: string, payload: { nom: string; montant: number; notes?: string }) {
    return this.http.post(`api/v1/epargne/${epargneId}/economie`, payload);
  }

  deleteEconomie(epargneId: string, economieId: string) {
    return this.http.delete(`api/v1/epargne/${epargneId}/economie/${economieId}`);
  }
}
