import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoAccesorio } from '../paginas/interfaces/tipoaccesorio';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class TiposAccesoriosService {

  private apiURL = `${environment.apiUrl}/api/tipos-accesorios`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  // ... (getAll, getActivos, find, findbyIdProductType se mantienen igual) ...
  
  getAll(): Observable<TipoAccesorio[]> {
    return this.httpClient.get<TipoAccesorio[]>(this.apiURL + '/')
      .pipe(catchError(this.errorHandler));
  }

  getActivos(): Observable<TipoAccesorio[]> {
    return this.httpClient.get<TipoAccesorio[]>(this.apiURL + '/activos')
      .pipe(catchError(this.errorHandler));
  }

  find(id: number): Observable<TipoAccesorio> {
    return this.httpClient.get<TipoAccesorio>(this.apiURL + '/' + id)
      .pipe(catchError(this.errorHandler));
  }
  
  findbyIdProductType(id: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/accesorios/accesorio/` + id)
      .pipe(catchError(this.errorHandler));
  }

  /**
   * POST: Crea un nuevo tipo de accesorio.
   * El backend espera en el body: { CodigoAccesorio, DescripcionAccesorio }
   */
  create(tipoAccesorio: Partial<TipoAccesorio>): Observable<any> {
    // ---- ⬇️ CORRECCIÓN ⬇️ ----
    // Dejamos de usar un 'body' parcial.
    // Pasamos el objeto y usamos JSON.stringify, igual que en el servicio de productos.
    return this.httpClient.post<any>(this.apiURL + '/', JSON.stringify(tipoAccesorio), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * PUT: Actualiza un tipo de accesorio existente.
   * El backend espera en el body: { CodigoAccesorio, DescripcionAccesorio, Activo }
   */
  update(tipoAccesorio: TipoAccesorio): Observable<any> {
    
    // ---- ⬇️ CORRECCIÓN ⬇️ ----
    // Revertimos mi cambio anterior.
    // Ahora usamos JSON.stringify sobre el objeto COMPLETO 'tipoAccesorio'.
    // Esto es IDÉNTICO a como funciona tu 'tipos-productos.service.ts'.
    return this.httpClient.put<any>(this.apiURL + '/' + tipoAccesorio.IdTipoAccesorioPK, JSON.stringify(tipoAccesorio), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * DELETE: Desactiva (soft delete) un tipo de accesorio.
   */
  deactivate(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.apiURL + '/' + id)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // ... (errorHandler se mantiene igual) ...
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
 }
}