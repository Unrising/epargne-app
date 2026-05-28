
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonNav, IonRouterOutlet, IonContent, IonSplitPane} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonNav, IonRouterOutlet, IonContent, IonSplitPane],
})
export class AppComponent {

  constructor() {
    //addIcons();
  }
}
