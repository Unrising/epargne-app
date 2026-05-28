import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonFooter, IonIcon, IonModal, IonButtons, IonItem, ModalController} from '@ionic/angular/standalone';
import { ProgressComponent } from 'src/app/components/progress/progress.component';
import { heart, add, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ModalCategorieComponent } from './modal/categorie/modal-categorie.component';
import { ModalEpargneComponent } from './modal/epargne/modal-epargne.component';
import { epargne } from './models/epargne';
import { EpargneService } from './services/epargne-service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-epargne',
  templateUrl: './epargne.page.html',
  styleUrls: ['./epargne.page.scss'],
  imports: [CommonModule, FormsModule, ProgressComponent, ModalCategorieComponent, ModalEpargneComponent, [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonFooter, IonIcon, IonModal, IonButtons, IonItem]]
})

export class EpargnePage implements OnInit {

  epargnes = signal<epargne[]>([]);

  epargneTotal = signal(0);
  epargneObjectif = signal(0);
  openEpargneId = signal('');

  constructor(private modalCtrl: ModalController, private epargneService: EpargneService, private router: Router, private authService: AuthService) {
    addIcons({heart, add, logOutOutline});
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.epargneService.getCategorie().subscribe({
      next: (epargnes) => {
        this.epargnes.set(epargnes);
        this.checkValue();
      },
      error: (err) => {
        console.log(err, err)
      }
    });
  }

  checkValue(){
    this.epargneTotal.set(this.epargnes().reduce((acc, epargne) => {return acc + Number(epargne.courant);}, 0));
    this.epargneObjectif.set(this.epargnes().reduce((acc, epargne) => {return acc + Number(epargne.montant);}, 0));
  }

  async openModalCategorieAsync() {
    const modal = await this.modalCtrl.create({
      component: ModalCategorieComponent,
      breakpoints: [0, 0.85, 1],
      initialBreakpoint: 0.85,
      componentProps: {
        epargnes: this.epargnes()
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data?.changed) this.loadData();
  }

  async openModalEpargneAsync() {
    const modal = await this.modalCtrl.create({
      component: ModalEpargneComponent,
      breakpoints: [0, 0.85, 1],
      initialBreakpoint: 0.85,
      componentProps: {
        epargnes: this.epargnes()
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data?.changed) this.loadData();
  }

  returnHome() {
    this.router.navigate(['/'], { replaceUrl: true });
  }

  toggleEpargne(id: string) {
    this.openEpargneId.set(this.openEpargneId() === id ? '' : id);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
