import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../paginas/interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class VentasBaseService {
  private accessoriesSubject = new BehaviorSubject<any[]>([]);


  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  ListarTodosLosMargenesVenta(): Observable<any> {
    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/ventas-base/margenes-venta')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  ListarTodosLosMetodosDePago(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/ventas-base/metodos-de-pago')
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
