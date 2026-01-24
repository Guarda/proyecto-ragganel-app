// src/app/services/image-upload-insumo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadInsumoService {
  private apiUrl = 'http://localhost:3000'; // URL base de tu API

  constructor(private http: HttpClient) {}

  /**
   * Sube un nuevo archivo de imagen de insumo al servidor.
   */
  uploadImage(image: File): Observable<{ message: string, filename: string }> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<{ message: string, filename: string }>(`${this.apiUrl}/upload-imagen-insumos`, formData);
  }

  /**
   * Obtiene la lista de imágenes de insumos existentes.
   */
  getExistingImages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/imagenes-existentes-insumos`).pipe(
      catchError(error => {
        console.error('Error fetching existing insumo images:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }
}