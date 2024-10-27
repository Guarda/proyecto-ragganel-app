import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FabricanteService {
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
    return this.httpClient.get(this.apiURL + '/fabricantes/listar-fabricantes/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * Write code on Method
   *
   * @return response()
   */

  create(NombreFabricante: string): Observable<any> {
    const fabricanteData = { NombreFabricante }; // Wrap the string in an object
    console.log(fabricanteData);
    return this.httpClient.post(this.apiURL + '/fabricantes/ingresar-fabricante/', fabricanteData, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  eliminar(Id: string): Observable<any> { 
    return this.httpClient.put(this.apiURL + '/fabricantes/fabricante-eliminar/' + Id, this.httpOptions)
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
