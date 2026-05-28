import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonFooter, IonIcon, IonModal, IonButtons, IonItem, ModalController} from '@ionic/angular/standalone';
import { ProgressComponent } from 'src/app/components/progress/progress.component';
import { heart, add, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CourantService } from './services/courant-service';
import { Router } from '@angular/router';
import { ModalCategorieComponent } from './modal/categorie/modal-categorie.component';
import { ModalDepenseComponent } from './modal/depense/modal-depense.component';
import depenseCategory from './models/depenseCategory';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-courant',
  templateUrl: './courant.page.html',
  styleUrls: ['./courant.page.scss'],
  imports: [CommonModule, FormsModule, ProgressComponent, ModalCategorieComponent, ModalDepenseComponent, [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonFooter, IonIcon, IonModal, IonButtons, IonItem]]
})

export class CourantPage implements OnInit {

  depenses = signal<depenseCategory[]>([]);

  depenseTotal = signal(0);
  depenseObjectif = signal(0);
  openDepenseId = signal('');

  constructor(private modalCtrl: ModalController, private courantService: CourantService, private router: Router, private authService: AuthService) {
    addIcons({heart, add, logOutOutline});
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.courantService.getDepense().subscribe({
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
  
  async openModalCategorieAsync() {
    const modal = await this.modalCtrl.create({
      component: ModalCategorieComponent,
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

  async openModalDepenseAsync() {
    const modal = await this.modalCtrl.create({
      component: ModalDepenseComponent,
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
