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
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./auth.page.scss'],
  imports: [CommonModule, FormsModule, RouterLink, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar],
})
export class RegisterPage {
  credentials = {
    email: '',
    password: '',
  };

  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ logInOutline, personAddOutline });
  }

  register() {
    this.message = '';
    this.isLoading = true;

    this.authService.register(this.credentials.email, this.credentials.password).subscribe({
      next: () => {
        this.authService.login(this.credentials.email, this.credentials.password).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigateByUrl('/', { replaceUrl: true });
          },
          error: () => {
            this.isLoading = false;
            this.message = 'Compte cree, mais la connexion a echoue.';
          },
        });
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Creation impossible. Cet email existe peut-etre deja.';
      },
    });
  }
}
