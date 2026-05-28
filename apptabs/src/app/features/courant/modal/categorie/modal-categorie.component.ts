import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  ModalController,
  IonSelectOption,
  IonSelect,
  IonInput,
  IonTextarea,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import depenseCategory from '../../models/depenseCategory';
import { CourantService } from '../../services/courant-service';

@Component({
  selector: 'app-modal-categorie',
  templateUrl: 'modal-categorie.component.html',
  styleUrls: ['./modal-categorie.component.scss'],
  standalone: true,
  imports: [CommonModule ,FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonIcon, IonCard, IonCardContent,IonCardSubtitle, IonCardTitle, IonCardContent, IonCardHeader, IonSelect, IonSelectOption, IonInput, IonTextarea],
})
export class ModalCategorieComponent {
  @Input() depenses: depenseCategory[] = [];

  selectedDepense: string = "";

  nouvelleCategorie = {
    nom: '',
    montant: 0,
    notes: '',
    couleurs: ''
  };

  constructor(private modalCtrl: ModalController, private courantService: CourantService) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  addCategorie() {
    if (!this.nouvelleCategorie.nom || this.nouvelleCategorie.montant <= 0) return;

    this.courantService.createCategorie(this.nouvelleCategorie).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

  deleteCategorie(id: string) {
    this.courantService.deleteCategorie(id).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

    onSelectedEpargne(): void {
    console.log(this.selectedDepense);
  }

  get currentDepense(): depenseCategory | undefined {
    if (!this.selectedDepense) return undefined;

    return this.depenses.find(
      e => e.id === this.selectedDepense
    );
  }
}
