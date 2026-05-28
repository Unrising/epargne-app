import { Component, input, OnInit, Signal } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  standalone: true,
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent  implements OnInit {

  titre = input("");
  courant = input(0);
  total = input(0);
  couleurs = input("black");
  constructor() { }

  ngOnInit() {}
  

  // Helper 

  calculPourcentage(courant: number, total: number) {
    if (total <= 0) return '0%';

    return Math.min((courant / total) * 100, 100) + '%';
  }
}
