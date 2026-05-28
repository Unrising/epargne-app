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
import { epargne } from '../../models/epargne';
import { CommonModule } from '@angular/common';
import { EpargneService } from '../../services/epargne-service';

@Component({
  selector: 'app-modal-categorie',
  templateUrl: 'modal-categorie.component.html',
  styleUrls: ['./modal-categorie.component.scss'],
  standalone: true,
  imports: [CommonModule ,FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonIcon, IonCard, IonCardContent,IonCardSubtitle, IonCardTitle, IonCardContent, IonCardHeader, IonSelect, IonSelectOption, IonInput, IonTextarea],
})
export class ModalCategorieComponent {
  @Input() epargnes: epargne[] = [];

  selectedEpargne: string = "";

  nouvelleCategorie = {
    nom: '',
    montant: 0,
    notes: '',
    couleurs: '#2563eb'
  };

  constructor(private modalCtrl: ModalController, private epargneService: EpargneService) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  addCategorie() {
    if (!this.nouvelleCategorie.nom || this.nouvelleCategorie.montant <= 0) return;

    this.epargneService.createCategorie(this.nouvelleCategorie).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

  deleteCategorie(id: string) {
    this.epargneService.deleteCategorie(id).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

    onSelectedEpargne(): void {
    console.log(this.selectedEpargne);
  }

  get currentEpargne(): epargne | undefined {
    if (!this.selectedEpargne) return undefined;

    return this.epargnes.find(
      e => e.id === this.selectedEpargne
    );
  }
}
