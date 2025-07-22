import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArticuloInventario } from '../paginas/interfaces/articuloinventario';

/**
 * Interfaz que define la estructura de un artículo en el inventario.
 * Usar interfaces mejora la seguridad de tipos y el autocompletado en tu código.
 */


@Injectable({
  providedIn: 'root'
})
export class InventarioGeneralService {
  // Asegúrate de que esta URL base sea la correcta para tu entorno.
  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  /**
   * Obtiene la lista completa de artículos del inventario desde el backend.
   * @returns Un Observable con un array de artículos de inventario.
   */
  getInventarioGeneral(): Observable<ArticuloInventario[]> {
    // Hacemos la llamada GET al endpoint /inventory/ que creamos.
    return this.httpClient.get<ArticuloInventario[]>(`${this.apiURL}/inventario/`)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * Manejador de errores centralizado para las peticiones HTTP.
   */
  private errorHandler(error: any) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error.
      // El cuerpo del error puede contener pistas de lo que falló.
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}