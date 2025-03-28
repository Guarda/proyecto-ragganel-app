import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, CommonModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    const loginData = {
      Correo: this.correo,
      Password: this.password
    };
  
    this.http.post('http://localhost:3000/auth/login', loginData)
    .subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        this.authService.login({
          id: response.user.id,
          name: response.user.name,
          avatarUrl: response.user.avatarUrl || null,
          role: response.user.role
        });
      },
      error: (error) => {
        console.log('Error de login:', error);
        this.errorMessage = error.error?.message || 'Error desconocido';
      }
    });
  }
}