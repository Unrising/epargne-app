import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, logOutOutline, repeatOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from '../auth/auth.service';
import { DepenseFixe } from './models/depense-fixe';
import { DepenseFixeService } from './services/depense-fixe-service';

@Component({
  selector: 'app-depense-fixe',
  templateUrl: './depense-fixe.page.html',
  styleUrls: ['./depense-fixe.page.scss'],
  imports: [CommonModule, FormsModule, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonTextarea, IonTitle, IonToolbar],
})
export class DepenseFixePage implements OnInit {
  depenses = signal<DepenseFixe[]>([]);
  message = signal('');

  form = {
    nom: '',
    montant: 0,
    jour: 1,
    notes: '',
  };

  total = computed(() => this.depenses().reduce((acc, depense) => acc + Number(depense.montant || 0), 0));

  constructor(
    private depenseFixeService: DepenseFixeService,
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ arrowBackOutline, logOutOutline, repeatOutline, trashOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.depenseFixeService.getDepensesFixes().subscribe({
      next: (depenses) => this.depenses.set(depenses),
      error: () => this.message.set('Impossible de charger les depenses fixes.'),
    });
  }

  addDepenseFixe() {
    if (!this.form.nom || this.form.montant <= 0 || this.form.jour < 1 || this.form.jour > 31) return;

    this.depenseFixeService.createDepenseFixe(this.form).subscribe({
      next: () => {
        this.form = { nom: '', montant: 0, jour: 1, notes: '' };
        this.message.set('');
        this.loadData();
      },
      error: () => this.message.set('Impossible d ajouter cette depense fixe.'),
    });
  }

  deleteDepenseFixe(id: string) {
    this.depenseFixeService.deleteDepenseFixe(id).subscribe({
      next: () => this.loadData(),
      error: () => this.message.set('Impossible de supprimer cette depense fixe.'),
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
