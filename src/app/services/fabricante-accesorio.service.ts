import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FabricanteAccesorioService {
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
      return this.httpClient.get(this.apiURL + '/fabricantes-accesorios/listar-fabricantes-accesorios/')
        .pipe(
          catchError(this.errorHandler)
        )
    }

    getAllBase(): Observable<any> {
      //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
      return this.httpClient.get(this.apiURL + '/fabricantes-accesorios/listar-fabricantes-accesorios-b/')
        .pipe(
          catchError(this.errorHandler)
        )
    }

    create(NombreFabricanteAccesorio: string): Observable<any> {
      const fabricanteData = { NombreFabricanteAccesorio }; // Wrap the string in an object
      console.log(fabricanteData);
      return this.httpClient.post(this.apiURL + '/fabricantes-accesorios/ingresar-fabricante-accesorios/', fabricanteData, this.httpOptions)
        .pipe(
          catchError(this.errorHandler)
        )
    }

    eliminar(Id: string): Observable<any> { 
      return this.httpClient.put(this.apiURL + '/fabricantes-accesorios/fabricante-eliminar-accesorios/' + Id, this.httpOptions)
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
