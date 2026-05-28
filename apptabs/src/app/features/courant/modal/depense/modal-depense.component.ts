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
  selector: 'app-modal-depense',
  templateUrl: 'modal-depense.component.html',
  styleUrls: ['./modal-depense.component.scss'],
  standalone: true,
  imports: [CommonModule ,FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonIcon, IonCard, IonCardContent,IonCardSubtitle, IonCardTitle, IonCardContent, IonCardHeader, IonSelect, IonSelectOption, IonInput, IonTextarea],
})
export class ModalDepenseComponent {
  @Input() depenses: depenseCategory[] = [];

  selectedDepense: string = "";

  nouvelleDepense = {
    nom: '',
    montant: 0,
    notes: ''
  };

  constructor(private modalCtrl: ModalController, private courantService: CourantService) {}

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

    this.courantService.createDepense(this.selectedDepense, this.nouvelleDepense).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

  deleteDepense(depenseId: string) {
    if (!this.selectedDepense) return;

    this.courantService.deleteDepense(this.selectedDepense, depenseId).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

  onSelectedDepense(): void {
    console.log(this.selectedDepense);
  }

  get currentDepense(): depenseCategory | undefined {
    if (!this.selectedDepense) return undefined;

    return this.depenses.find(
      e => e.id === this.selectedDepense
    );
  }
}
