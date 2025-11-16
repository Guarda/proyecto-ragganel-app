// Archivo: src/app/services/backup.service.ts
// VERSIÓN CORREGIDA

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para la respuesta del backend
export interface BackupResponse {
  success: boolean;
  message: string;
  filename: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private apiURL = "http://localhost:3000/api/backup";

  constructor(private http: HttpClient) { }

  /**
   * Solicita la creación de un backup al backend.
   * AÑADE el token de autorización.
   */
  createBackup(): Observable<BackupResponse> {
    
    const token = localStorage.getItem('token'); // Esto ya contiene "Bearer <token>"
    
    // ===== ⭐️ LA CORRECCIÓN ESTÁ AQUÍ ⭐️ =====
    // Simplemente pasamos el token tal cual lo guardamos.
    const headers = new HttpHeaders({
      'Authorization': token || '' // <-- No añadimos "Bearer "
    });
    // ============================================

    return this.http.get<BackupResponse>(`${this.apiURL}/create`, { headers: headers });
  }
}