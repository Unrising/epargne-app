import { Routes } from '@angular/router';
import { EpargnePage } from './features/epargne/epargne.page';
import { CourantPage } from './features/courant/courant.page';
import { RevenuPage } from './features/revenu/revenu.page';
import { CommunPage } from './features/commun/commun.page';
import { HomePage } from './features/home/home.page';
import { LoginPage } from './features/auth/login.page';
import { RegisterPage } from './features/auth/register.page';
import { SalairePage } from './features/salaire/salaire.page';
import { DepenseFixePage } from './features/depense-fixe/depense-fixe.page';

export const routes: Routes = [
  { path: "", component: HomePage },
  { path: "login", component: LoginPage },
  { path: "register", component: RegisterPage },
  { path: "epargne", component: EpargnePage },
  { path: "courant", component: CourantPage },
  { path: "revenu", component: RevenuPage },
  { path: "commun", component: CommunPage },
  { path: "salaire", component: SalairePage },
  { path: "depense-fixe", component: DepenseFixePage },
];
