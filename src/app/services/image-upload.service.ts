// src/app/services/image-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Sube un nuevo archivo de imagen al servidor.
   */
  uploadImage(image: File): Observable<{ message: string, filename: string }> {
    const formData = new FormData();
    formData.append('image', image);
    // Renombrado para mayor claridad y consistencia
    return this.http.post<{ message: string, filename: string }>(`${this.apiUrl}/upload-imagen-producto`, formData);
  }

  /**
   * Obtiene la lista de nombres de archivo de las imágenes existentes en el servidor.
   */
  getExistingImages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/imagenes-existentes-productos`).pipe(
      catchError(error => {
        console.error('Error fetching existing images:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }
}