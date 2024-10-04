import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
    return this.httpClient.get(this.apiURL + '/productos/listar-categorias/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * Write code on Method
   *
   * @return response()
   */

  getbymanufacturer(fabricante: number, categoria: number, subcategoria: number): Observable<any> {
    
    
    let params = new HttpParams()
    .set('Fabricante', fabricante)
    .set('Categoria', categoria)
    .set('Subcategoria', subcategoria);

    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/categorias/categoria/', {params})
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
    return this.httpClient.post(this.apiURL + '/categorias/crear-categoria-producto/', JSON.stringify(categoria), this.httpOptions)
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
    return this.httpClient.get(this.apiURL + '/categorias/categoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  update(categoria: CategoriasConsolas): Observable<any> {
    return this.httpClient.put(this.apiURL + '/categorias/categoria/' + categoria.IdModeloConsolaPK, JSON.stringify(categoria), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  eliminar(categoria: CategoriasConsolas): Observable<any> {   
    console.log(categoria) 
    return this.httpClient.put(this.apiURL + '/categorias/categoria-eliminar/' + categoria.IdModeloConsolaPK, JSON.stringify(categoria), this.httpOptions)
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
