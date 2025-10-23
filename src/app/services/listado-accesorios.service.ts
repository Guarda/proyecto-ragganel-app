import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoAccesorio } from '../paginas/interfaces/tipoaccesorio';

@Injectable({
  providedIn: 'root'
})
export class ListadoTipoAccesorioService {
  // URL base de tu API Node.js
  private apiURL = "http://localhost:3000/api/tipos-accesorios";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  /**
   * GET: Obtiene TODOS los tipos de accesorios (activos e inactivos).
   * Para la pantalla de administración.
   * Corresponde a: GET /api/tipos-accesorios
   */
  getAll(): Observable<TipoAccesorio[]> {
    return this.httpClient.get<TipoAccesorio[]>(this.apiURL + '/')
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * GET: Obtiene solo los tipos de accesorios ACTIVOS.
   * Para poblar dropdowns y selecciones.
   * Corresponde a: GET /api/tipos-accesorios/activos
   */
  getActivos(): Observable<TipoAccesorio[]> {
    return this.httpClient.get<TipoAccesorio[]>(this.apiURL + '/activos')
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * GET: Obtiene un tipo de accesorio específico por su ID.
   * Corresponde a: GET /api/tipos-accesorios/:id
   */
  find(id: number): Observable<TipoAccesorio> {
    return this.httpClient.get<TipoAccesorio>(this.apiURL + '/' + id)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * POST: Crea un nuevo tipo de accesorio.
   * Corresponde a: POST /api/tipos-accesorios
   * El backend espera en el body: { CodigoAccesorio, DescripcionAccesorio }
   */
  create(tipoAccesorio: Partial<TipoAccesorio>): Observable<any> {
    // Asegúrate de enviar solo las propiedades necesarias para la creación
    const body = {
      CodigoAccesorio: tipoAccesorio.CodigoAccesorio,
      DescripcionAccesorio: tipoAccesorio.DescripcionAccesorio
    };
    return this.httpClient.post<any>(this.apiURL + '/', JSON.stringify(body), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * PUT: Actualiza un tipo de accesorio existente.
   * Corresponde a: PUT /api/tipos-accesorios/:id
   * El backend espera en el body: { CodigoAccesorio, DescripcionAccesorio, Activo }
   */
  update(tipoAccesorio: TipoAccesorio): Observable<any> {
    return this.httpClient.put<any>(this.apiURL + '/' + tipoAccesorio.IdTipoAccesorioPK, JSON.stringify(tipoAccesorio), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * DELETE: Desactiva (soft delete) un tipo de accesorio.
   * Corresponde a: DELETE /api/tipos-accesorios/:id
   */
  deactivate(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + '/' + id)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * Manejador de errores estándar.
   */
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage); // Loguea el error a la consola
    return throwError(() => new Error(errorMessage)); // Usa la nueva sintaxis para throwError
  }
}