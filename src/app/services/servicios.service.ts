import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiciosBase } from '../paginas/interfaces/servicios';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private apiURL = "http://localhost:3000";

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
    return this.httpClient.get(this.apiURL + '/servicios-base/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findById(id: number): Observable<any> {
    return this.httpClient.get(this.apiURL + '/servicios-base/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  listSupplies(id: number): Observable<any> {
    return this.httpClient.get(this.apiURL + '/servicios-base/insumos/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(servicios: ServiciosBase): Observable<any> {
    return this.httpClient.post(this.apiURL + '/servicios-base/crear-servicio/', JSON.stringify(servicios), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  update(servicios: ServiciosBase): Observable<any> {
    return this.httpClient.put(
      this.apiURL + '/servicios-base/actualizar-servicio/',
      servicios,
      this.httpOptions
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(this.apiURL + '/servicios-base/eliminar-servicio/' + id, this.httpOptions)
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
