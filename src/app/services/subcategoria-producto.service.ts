import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SubcategoriasProductos } from '../paginas/interfaces/subcategoriasproductos';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaProductoService {
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
    return this.httpClient.get(this.apiURL + '/catesubcate/listar-subcate/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

   /**
   * Write code on Method
   *
   * @return response()
   */

   find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate/listar-subcate/' + id)
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
