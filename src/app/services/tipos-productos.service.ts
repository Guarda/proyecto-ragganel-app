import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoProducto } from '../paginas/interfaces/tipoproducto';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class TiposProductosService {
  private apiURL = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  /**
   * Write code on Method
   *
   * @return response()
   */

  getAll(): Observable<any> {
    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/productos/listar-tipos-productos/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getList(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/api/tipos-producto/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getAccesoriosDisponibles(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/api/tipos-producto/accesorios-disponibles')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * GET: Obtiene un tipo de producto específico por ID.
   * Corresponde a: GET /api/tipos-producto/:id
   */
  find(id: number | string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/api/tipos-producto/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * POST: Crea un nuevo tipo de producto.
   * Corresponde a: POST /api/tipos-producto
   * El backend espera en el body: { descripcion, accesorios }
   */
  create(tipoProducto: TipoProducto): Observable<any> {
    return this.httpClient.post(this.apiURL + '/api/tipos-producto/', JSON.stringify(tipoProducto), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * PUT: Actualiza un tipo de producto existente.
   * Corresponde a: PUT /api/tipos-producto/:id
   * El backend espera en el body: { descripcion, activo, accesorios }
   */
  update(tipoProducto: TipoProducto): Observable<any> {

    const id = (tipoProducto as any).IdTipoProductoPK;

    if (id === undefined) {
      console.error("El ID del Tipo de Producto es undefined. No se puede actualizar.");
      return throwError("Error: El ID del producto no puede ser undefined.");
    }

    return this.httpClient.put(this.apiURL + '/api/tipos-producto/' + id, JSON.stringify(tipoProducto), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
