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
  selector: 'app-modal-depense-commun',
  templateUrl: 'modal-depense-commun.component.html',
  styleUrls: ['./modal-depense-commun.component.scss'],
  imports: [CommonModule ,FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonIcon, IonCard, IonCardContent,IonCardSubtitle, IonCardTitle, IonCardContent, IonCardHeader, IonSelect, IonSelectOption, IonInput, IonTextarea],
})

export class ModalDepenseCommunComponent {
  @Input() depenses: depenseCommunCategory[] = [];

  selectedDepense: string = "";

  nouvelleDepense = {
    nom: '',
    montant: 0,
    notes: ''
  };

  constructor(private modalCtrl: ModalController, private communService: CommunService) {}

  ngOnInit() {
    this.selectedDepense = this.depenses[0]?.id || '';
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  addDepense() {
    if (!this.selectedDepense || !this.nouvelleDepense.nom || this.nouvelleDepense.montant <= 0) return;

    this.communService.createDepense(this.selectedDepense, this.nouvelleDepense).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

  deleteDepense(depenseId: string) {
    if (!this.selectedDepense) return;

    this.communService.deleteDepense(this.selectedDepense, depenseId).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

  onSelectedDepense(): void {
    console.log(this.selectedDepense);
  }

  get currentDepense(): depenseCommunCategory | undefined {
    if (!this.selectedDepense) return undefined;

    return this.depenses.find(
      e => e.id === this.selectedDepense
    );
  }
}
