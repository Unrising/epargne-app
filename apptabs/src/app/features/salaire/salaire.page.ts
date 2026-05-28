import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, logOutOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from '../auth/auth.service';
import { Salaire } from './models/salaire';
import { SalaireService } from './services/salaire-service';

@Component({
  selector: 'app-salaire',
  templateUrl: './salaire.page.html',
  styleUrls: ['./salaire.page.scss'],
  imports: [CommonModule, FormsModule, IonButton, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonTextarea, IonTitle, IonToolbar],
})
export class SalairePage implements OnInit {
  salaires = signal<Salaire[]>([]);
  message = signal('');

  form = {
    nom: 'Salaire',
    montant: 0,
    mois: new Date().toISOString(),
    notes: '',
  };

  total = computed(() => this.salaires().reduce((acc, salaire) => acc + Number(salaire.montant || 0), 0));

  constructor(
    private salaireService: SalaireService,
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ arrowBackOutline, calendarOutline, logOutOutline, trashOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.salaireService.getSalaires().subscribe({
      next: (salaires) => this.salaires.set(salaires),
      error: () => this.message.set('Impossible de charger les salaires.'),
    });
  }

  addSalaire() {
    if (!this.form.nom || this.form.montant <= 0 || !this.form.mois) return;

    this.salaireService.createSalaire(this.form).subscribe({
      next: () => {
        this.form = { nom: 'Salaire', montant: 0, mois: new Date().toISOString(), notes: '' };
        this.message.set('');
        this.loadData();
      },
      error: () => this.message.set('Impossible d ajouter ce salaire.'),
    });
  }

  deleteSalaire(id: string) {
    this.salaireService.deleteSalaire(id).subscribe({
      next: () => this.loadData(),
      error: () => this.message.set('Impossible de supprimer ce salaire.'),
    });
  }

  returnHome() {
    this.router.navigate(['/'], { replaceUrl: true });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
