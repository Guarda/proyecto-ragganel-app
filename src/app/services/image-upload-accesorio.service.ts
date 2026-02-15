// src/app/services/image-upload-accesorio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadAccesorioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Sube un nuevo archivo de imagen de accesorio al servidor.
   */
  uploadImage(image: File): Observable<{ message: string, filename: string }> {
    const formData = new FormData();
    formData.append('image', image);
    // ⬇️ Usa el endpoint específico para accesorios
    return this.http.post<{ message: string, filename: string }>(`${this.apiUrl}/upload-imagen-accesorios`, formData);
  }

  /**
   * Obtiene la lista de imágenes de accesorios existentes.
   */
  getExistingImages(): Observable<string[]> {
    // ⬇️ Usa un nuevo endpoint para obtener solo imágenes de accesorios
    return this.http.get<string[]>(`${this.apiUrl}/imagenes-existentes-accesorios`).pipe(
      catchError(error => {
        console.error('Error fetching existing accessory images:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }
}