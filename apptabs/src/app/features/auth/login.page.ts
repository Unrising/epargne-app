import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, personAddOutline } from 'ionicons/icons';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./auth.page.scss'],
  imports: [CommonModule, FormsModule, RouterLink, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar],
})
export class LoginPage {
  credentials = {
    email: '',
    password: '',
  };

  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ logInOutline, personAddOutline });
  }

  login() {
    this.message = '';
    this.isLoading = true;

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Connexion impossible. Verifie ton email et ton mot de passe.';
      },
    });
  }
}
