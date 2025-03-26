import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatLabel, FormsModule, CommonModule, MatInputModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo!: string;
  password!: string;
  errorMessage!: string;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const loginData = {
      Correo: this.correo,
      Password: this.password
    };
  
    this.http.post('http://localhost:3000/auth/login', loginData)
    .subscribe((response: any) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user)); // Guarda info del usuario
  
      const returnUrl = localStorage.getItem('returnUrl') || '/home';
      console.log('🔄 Redirigiendo a:', returnUrl); // Verifica la URL antes de redirigir
  
      localStorage.removeItem('returnUrl'); // Borramos la URL después de usarla
      this.router.navigateByUrl(returnUrl); // Redirige a la página guardada
    }, error => {
      console.log('Error de login:', error);
      this.errorMessage = error.error.message;
    });
  }
  
  
}
