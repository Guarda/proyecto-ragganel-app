import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuSidebarComponent } from './UI/ui/menu-sidebar.component';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from './utiles/customs/custom-date-adapter';
import { CUSTOM_DATE_FORMATS } from './utiles/customs/date-format';
import { LoginComponent } from "./UI/session/login/login.component";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MenuSidebarComponent, MatNativeDateModule, LoginComponent, CommonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' } // Optional: Set locale to British English for DD/MM/YYYY
    ]
})
export class AppComponent implements OnInit {

  constructor ( private router: Router){
    
  }
  title = 'proyecto-ragganel-app';
  http = inject(HttpClient);
  currentEnvironment = signal('desconocido');

  ngOnInit() {
    const token = localStorage.getItem('token');
    
    // Verificar si ya hay un token almacenado
    if (token) {
      // Si el usuario está autenticado y está en la página raíz ('/') 
      if (this.router.url === '/') {
        this.router.navigate(['/home']);  // Redirigir a home si estamos en la raíz
      }
    } else {
      // Si no hay token, redirigir al login
      this.router.navigate(['/login']);
    }
    this.checkEnvironment();
  }
  
  checkEnvironment() {
    // Angular usará el proxy automáticamente para esta llamada
    this.http.get<{ environment: string }>('/api/config/environment').subscribe(res => {
      this.currentEnvironment.set(res.environment);
      console.log(`Backend está en modo: ${res.environment}`);
    });
  }
}
