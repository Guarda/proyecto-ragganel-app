import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// 1. Define the correct interface (singular, matching the source file)
//    (You can move this to your interfaces folder if you prefer)
export interface TipoAccesorio {
  IdTipoAccesorioPK: number;
  CodigoAccesorio: string;
  DescripcionAccesorio: string;
  Activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TiposAccesoriosService {

  // 2. Correct the base API URL to point to the new endpoints
  private apiURL = "http://localhost:3000/api/tipos-accesorios";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  // --- Methods copied/adapted from listado-accesorios.service.ts ---

  /**
   * GET: Obtiene TODOS los tipos de accesorios (activos e inactivos).
   * Para la pantalla de administración.
   * Corresponde a: GET /api/tipos-accesorios
   */
  getAll(): Observable<TipoAccesorio[]> {
    return this.httpClient.get<TipoAccesorio[]>(this.apiURL + '/') // Use correct apiURL
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
    return this.httpClient.get<TipoAccesorio[]>(this.apiURL + '/activos') // Use correct apiURL
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * GET: Obtiene un tipo de accesorio específico por su ID.
   * Corresponde a: GET /api/tipos-accesorios/:id
   * (Replaces the old find method)
   */
  find(id: number): Observable<TipoAccesorio> { // Changed id type to number
    return this.httpClient.get<TipoAccesorio>(this.apiURL + '/' + id) // Use correct apiURL and interface
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
    const body = {
      CodigoAccesorio: tipoAccesorio.CodigoAccesorio,
      DescripcionAccesorio: tipoAccesorio.DescripcionAccesorio
    };
    return this.httpClient.post<any>(this.apiURL + '/', JSON.stringify(body), this.httpOptions) // Use correct apiURL
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
    return this.httpClient.put<any>(this.apiURL + '/' + tipoAccesorio.IdTipoAccesorioPK, JSON.stringify(tipoAccesorio), this.httpOptions) // Use correct apiURL
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * DELETE: Desactiva (soft delete) un tipo de accesorio.
   * Corresponde a: DELETE /api/tipos-accesorios/:id
   */
  deactivate(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + '/' + id) // Use correct apiURL
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // --- Existing Error Handler (kept as is) ---
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage); // Log the error
    return throwError(() => new Error(errorMessage)); // Use newer throwError syntax
 }
}