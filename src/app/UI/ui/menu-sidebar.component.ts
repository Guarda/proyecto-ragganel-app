import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_MENU_PANEL, MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ListarProductosComponent } from "../../paginas/productos/listar-productos/listar-productos.component";
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../session/auth.service';
import { Subscription } from 'rxjs'; // Importa Subscription de rxjs
import { RouterModule, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-menu-sidebar',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule, RouterOutlet, RouterLink, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatMenuModule, MatBadgeModule, ListarProductosComponent],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.css'
})
export class MenuSidebarComponent implements OnInit, OnDestroy {
  user: any = null; // Variable para almacenar la información del usuario
  UserName: string = '';
  UserId!: number;
  ImagePath: string = '';
  private userSubscription: Subscription = new Subscription(); // Inicializar correctamente

  

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // Añadir ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.getUser().subscribe((user: { name: string; avatarUrl: string | null; id: number; role: number; } | null) => {
      this.user = user;
      if (user) {
        this.UserName = user.name;
        this.ImagePath = this.getimagePath(user.avatarUrl);
        this.UserId = user.id;
      } else {
        this.UserName = '';
        this.ImagePath = '';
        this.UserId = 0;
      }
  
      // 🚀 Forzar la detección de cambios
      this.cdr.detectChanges();
    });
  
    this.router.navigate(['/home']);
  }
  


  private updateUserData(user: { name: string; avatarUrl: string | null; id: number; }) {
    if (user) {
      this.user = user;
      this.UserName = user.name;
      this.ImagePath = this.getimagePath(user.avatarUrl);
      this.UserId = user.id;
    } else {
      this.UserName = '';
      this.ImagePath = '';
      this.UserId = 0;
    }
  }
  ngOnDestroy(): void {
    // Asegúrate de limpiar la suscripción al componente
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  viewProfile() {
    this.router.navigate(['home/administracion/ver-usuario', this.UserId, 'view']);
  }

  getimagePath(l: string | null): string {
    const baseUrl = 'http://localhost:3000'; // Asegúrate de que este es el puerto correcto de tu servidor
    return l ? `${baseUrl}/assets/${l}` : `${baseUrl}/assets/avatardefault.png`;
  }

  logout(): void {
    this.authService.logout(); // Lógica para cerrar sesión
  }
}