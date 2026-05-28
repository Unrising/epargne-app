import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonFooter, IonIcon, IonModal, IonButtons, IonItem, ModalController} from '@ionic/angular/standalone';
import { ProgressComponent } from 'src/app/components/progress/progress.component';
import { heart, add, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CommunService } from './services/commun-service';
import { Router } from '@angular/router';
import depenseCommunCategory from './models/depenseCommunCategory';
import { ModalCategorieCommunComponent } from './modal/categorie/modal-categorie-commun.component';
import { ModalDepenseCommunComponent } from './modal/depense/modal-depense-commun.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-commun',
  templateUrl: './commun.page.html',
  styleUrls: ['./commun.page.scss'],
  imports: [CommonModule, FormsModule, ProgressComponent, ModalCategorieCommunComponent, ModalDepenseCommunComponent, [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonFooter, IonIcon, IonModal, IonButtons, IonItem]]
})

export class CommunPage implements OnInit {

  depenses = signal<depenseCommunCategory[]>([]);
  depenseTotal = signal(0);
  depenseObjectif = signal(0);
  openDepenseId = signal('');
  constructor(private modalCtrl: ModalController, private communService: CommunService, private router: Router, private authService: AuthService) {
    addIcons({heart, add, logOutOutline});
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.communService.getDepense().subscribe({
      next: (depenses) => {
        this.depenses.set(depenses);
        this.checkValue();
      },
      error: (err) => {
        console.log(err, err)
      }
    });
  }

  checkValue(){
    this.depenseTotal.set(this.depenses().reduce((acc, depense) => {return acc + Number(depense.courant);}, 0));
    this.depenseObjectif.set(this.depenses().reduce((acc, depense) => {return acc + Number(depense.montant);}, 0));
  }

  async openModalCategorieCommunAsync() {
    const modal = await this.modalCtrl.create({
      component: ModalCategorieCommunComponent,
      breakpoints: [0, 0.85, 1],
      initialBreakpoint: 0.85,
      componentProps: {
        depenses: this.depenses()
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data?.changed) this.loadData();
  }

  async openModalDepenseCommunAsync() {
    const modal = await this.modalCtrl.create({
      component: ModalDepenseCommunComponent,
      breakpoints: [0, 0.85, 1],
      initialBreakpoint: 0.85,
      componentProps: {
        depenses: this.depenses()
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data?.changed) this.loadData();
  }

  returnHome() {
    this.router.navigate(['/'], { replaceUrl: true });
  }

  toggleDepense(id: string) {
    this.openDepenseId.set(this.openDepenseId() === id ? '' : id);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
