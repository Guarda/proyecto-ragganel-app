import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriasConsolas } from '../paginas/interfaces/categorias';

@Injectable({
  providedIn: 'root'
})
export class CategoriasConsolasService {
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
    return this.httpClient.get(this.apiURL + '/listar-categorias/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * Write code on Method
   *
   * @return response()
   */

  create(categoria: CategoriasConsolas): Observable<any> {
    return this.httpClient.post(this.apiURL + '/crear-categoria-producto/', JSON.stringify(categoria), this.httpOptions)
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
    return this.httpClient.get(this.apiURL + '/categoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  update(categoria: CategoriasConsolas): Observable<any> {
    return this.httpClient.put(this.apiURL + '/categoria/' + categoria.IdModeloConsolaPK, JSON.stringify(categoria), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  eliminar(categoria: CategoriasConsolas): Observable<any> {   
    console.log(categoria) 
    return this.httpClient.put(this.apiURL + '/categoria-eliminar/' + categoria.IdModeloConsolaPK, JSON.stringify(categoria), this.httpOptions)
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
