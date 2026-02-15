import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class NotasCreditoService {

  private apiURL = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  /**
   * Envía los datos de una nueva nota de crédito al backend para ser creada.
   * @param datosNotaCredito El objeto que contiene toda la información de la nota de crédito.
   * @returns Un Observable con la respuesta del servidor.
   */
  crearNotaCredito(datosNotaCredito: any): Observable<any> {
    // La URL debe coincidir con la que definiste en tu backend (app.js y credit-notes.js)
    const url = `${this.apiURL}/notas-credito/crear`;
    
    console.log('[CreditNotesService] Enviando datos para crear nota de crédito:', datosNotaCredito);

    return this.httpClient.post(url, datosNotaCredito, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  getNotasCredito(): Observable<any[]> {
    const url = `${this.apiURL}/notas-credito/listar`;
    
    return this.httpClient.get<any>(url, this.httpOptions).pipe(
      // Usamos map para extraer directamente el array 'data' de la respuesta del backend
      map((response: any) => response.data),
      catchError(this.errorHandler)
    );
  }

  getNotaCreditoById(id: number): Observable<any> {
    const url = `${this.apiURL}/notas-credito/${id}`;
    
    return this.httpClient.get<any>(url).pipe(
      // Mapeamos la respuesta para devolver directamente el objeto 'data'
      map(response => response.data),
      catchError(this.errorHandler)
    );
  }

  // Asegúrate de que la URL incluye el prefijo
anularNotaCredito(idNota: number, motivo: string, usuarioId: number): Observable<any> {
    const body = { motivo, usuarioId };
    return this.httpClient.put(`${this.apiURL}/notas-credito/anular/${idNota}`, body); 
}

  /**
   * Manejador de errores simple para las peticiones HTTP.
   */
  private errorHandler(error: any) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de Error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}