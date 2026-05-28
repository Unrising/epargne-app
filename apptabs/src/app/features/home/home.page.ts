import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { calendarOutline, cardOutline, cashOutline, logOutOutline, peopleOutline, pieChartOutline, repeatOutline, walletOutline } from 'ionicons/icons';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  authMessage = '';

  sections = [
    {
      route: 'epargne',
      title: 'Epargne',
      subtitle: 'Objectifs, economies et progression',
      icon: 'wallet-outline',
      tone: 'blue',
    },
    {
      route: 'revenu',
      title: 'Dashboard',
      subtitle: 'Epargne, courant et commun en un coup d oeil',
      icon: 'cash-outline',
      tone: 'green',
    },
    {
      route: 'courant',
      title: 'Courant',
      subtitle: 'Depenses personnelles du mois',
      icon: 'card-outline',
      tone: 'pink',
    },
    {
      route: 'commun',
      title: 'Commun',
      subtitle: 'Budget partage et categories',
      icon: 'people-outline',
      tone: 'purple',
    },
    {
      route: 'salaire',
      title: 'Salaire',
      subtitle: 'Montant mensuel et historique',
      icon: 'calendar-outline',
      tone: 'teal',
    },
    {
      route: 'depense-fixe',
      title: 'Fixes',
      subtitle: 'Charges recurrentes du mois',
      icon: 'repeat-outline',
      tone: 'slate',
    },
  ];

  constructor(private router: Router, public authService: AuthService) {
    addIcons({ calendarOutline, cardOutline, cashOutline, logOutOutline, peopleOutline, pieChartOutline, repeatOutline, walletOutline });
  }

  goTo(page: string) {
    if (!this.authService.isConnected() && !['login', 'register'].includes(page)) {
      this.authMessage = 'Connecte-toi pour charger tes donnees budget.';
      return;
    }

    this.router.navigateByUrl(`/${page}`);
  }

  logout() {
    this.authService.logout();
    this.authMessage = 'Session fermee.';
  }

  ngOnInit() {}
}
