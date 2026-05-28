import { Component, Input, OnInit } from '@angular/core';
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
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { epargne } from '../../models/epargne';
import { CommonModule } from '@angular/common';
import { EpargneService } from '../../services/epargne-service';

@Component({
  selector: 'app-modal-epargne',
  templateUrl: 'modal-epargne.component.html',
  styleUrls: ['./modal-epargne.component.scss'],
  standalone: true,
  imports: [CommonModule ,FormsModule, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonIcon, IonCard, IonCardContent,IonCardSubtitle, IonCardTitle, IonCardContent, IonCardHeader, IonSelect, IonSelectOption, IonInput, IonTextarea],
})
export class ModalEpargneComponent implements OnInit {

  @Input() epargnes: epargne[] = [];

  selectedEpargne: string = "";
  
  nouvelleEconomie = {
    nom: '',
    montant: 0,
    notes: ''
  };
  
  constructor(private modalCtrl: ModalController, private epargneService: EpargneService) {
    addIcons({add});
  }

  ngOnInit() {
    this.selectedEpargne = this.epargnes[0]?.id || '';
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  addEconomie() {
    if (!this.selectedEpargne || !this.nouvelleEconomie.nom || this.nouvelleEconomie.montant <= 0) return;

    this.epargneService.createEconomie(this.selectedEpargne, this.nouvelleEconomie).subscribe({
      next: () => this.modalCtrl.dismiss({ changed: true }, 'confirm'),
      error: (err) => console.log(err),
    });
  }

  deleteEconomie(economieId: string) {
    if (!this.selectedEpargne) return;

    this.epargneService.deleteEconomie(this.selectedEpargne, economieId).subscribe({
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
