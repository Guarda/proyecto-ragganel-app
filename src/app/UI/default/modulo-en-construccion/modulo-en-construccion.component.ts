import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [MatIcon],
  selector: 'app-modulo-en-construccion',
  templateUrl: './modulo-en-construccion.component.html',
  styleUrls: ['./modulo-en-construccion.component.css']
})
export class ModuloEnConstruccionComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']); // Redirige a la página de inicio
  }
}
