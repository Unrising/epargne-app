import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { arrowBackOutline, cardOutline, logOutOutline, peopleOutline, refreshOutline, walletOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { epargne } from '../epargne/models/epargne';
import depenseCategory from '../courant/models/depenseCategory';
import depenseCommunCategory from '../commun/models/depenseCommunCategory';
import { EpargneService } from '../epargne/services/epargne-service';
import { CourantService } from '../courant/services/courant-service';
import { CommunService } from '../commun/services/commun-service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-revenu',
  templateUrl: './revenu.page.html',
  styleUrls: ['./revenu.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSpinner]
})

export class RevenuPage implements OnInit {
  epargnes = signal<epargne[]>([]);
  courant = signal<depenseCategory[]>([]);
  commun = signal<depenseCommunCategory[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  epargneTotal = computed(() => this.sum(this.epargnes(), 'courant'));
  epargneObjectif = computed(() => this.sum(this.epargnes(), 'montant'));
  courantTotal = computed(() => this.sum(this.courant(), 'courant'));
  courantBudget = computed(() => this.sum(this.courant(), 'montant'));
  communTotal = computed(() => this.sum(this.commun(), 'courant'));
  communBudget = computed(() => this.sum(this.commun(), 'montant'));
  resteCourant = computed(() => this.courantBudget() - this.courantTotal());
  resteCommun = computed(() => this.communBudget() - this.communTotal());
  epargneProgress = computed(() => this.percent(this.epargneTotal(), this.epargneObjectif()));
  courantProgress = computed(() => this.percent(this.courantTotal(), this.courantBudget()));
  communProgress = computed(() => this.percent(this.communTotal(), this.communBudget()));

  cards = computed(() => [
    {
      title: 'Epargne',
      icon: 'wallet-outline',
      tone: 'blue',
      value: this.epargneTotal(),
      target: this.epargneObjectif(),
      label: 'Objectif',
      progress: this.epargneProgress(),
      route: '/epargne',
    },
    {
      title: 'Courant',
      icon: 'card-outline',
      tone: 'pink',
      value: this.courantTotal(),
      target: this.courantBudget(),
      label: 'Budget',
      progress: this.courantProgress(),
      route: '/courant',
    },
    {
      title: 'Commun',
      icon: 'people-outline',
      tone: 'purple',
      value: this.communTotal(),
      target: this.communBudget(),
      label: 'Budget',
      progress: this.communProgress(),
      route: '/commun',
    },
  ]);

  constructor(
    private router: Router,
    private epargneService: EpargneService,
    private courantService: CourantService,
    private communService: CommunService,
    private authService: AuthService
  ) {
    addIcons({ arrowBackOutline, cardOutline, logOutOutline, peopleOutline, refreshOutline, walletOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      epargnes: this.epargneService.getCategorie(),
      courant: this.courantService.getDepense(),
      commun: this.communService.getDepense(),
    }).subscribe({
      next: ({ epargnes, courant, commun }) => {
        this.epargnes.set(epargnes);
        this.courant.set(courant);
        this.commun.set(commun);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger le dashboard. Verifie que le backend est lance et que tu es connecte.');
      },
    });
  }

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }

  returnHome() {
    this.router.navigate(['/'], { replaceUrl: true });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private sum(items: Array<{ courant: number; montant: number }>, field: 'courant' | 'montant') {
    return items.reduce((acc, item) => acc + Number(item[field] || 0), 0);
  }

  private percent(value: number, total: number) {
    if (!total) {
      return 0;
    }

    return Math.min(Math.round((value / total) * 100), 100);
  }
}
