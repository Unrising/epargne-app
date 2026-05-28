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
import depenseCommunCategory from '../../models/depenseCommunCategory';
import { CommunService } from '../../services/commun-service';

@Component({
  selector: 'app-modal-categorie-commun',
  templateUrl: 'modal-categorie-commun.component.html',
  styleUrls: ['./modal-categorie-commun.component.scss'],
  standalone: true,
  imports: [CommonModule ,FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonIcon, IonCard, IonCardContent,IonCardSubtitle, IonCardTitle, IonCardContent, IonCardHeader, IonSelect, IonSelectOption, IonInput, IonTextarea],
})
export class ModalCategorieCommunComponent {
  @Input() depenses: depenseCommunCategory[] = [];

  selectedDepense: string = "";

  nouvelleCategorie = {
    nom: '',
    montant: 0,
    notes: '',
    couleurs: ''
  };

  constructor(private modalCtrl: ModalController, private communService: CommunService) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  addCategorie() {
    if (!this.nouvelleCategorie.nom || this.nouvelleCategorie.montant <= 0) return;

    this.communService.createCategorie(this.nouvelleCategorie).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

  deleteCategorie(id: string) {
    this.communService.deleteCategorie(id).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

    onSelectedEpargne(): void {
    console.log(this.selectedDepense);
  }

  get currentDepense(): depenseCommunCategory | undefined {
    if (!this.selectedDepense) return undefined;

    return this.depenses.find(
      e => e.id === this.selectedDepense
    );
  }
}
