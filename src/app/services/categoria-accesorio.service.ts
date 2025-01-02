import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriaAccesorioService {
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
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/listar-cate-accesorio/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getAllBase(): Observable<any> {
    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/listar-cate-accesorio-b/')
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
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/listar-cate-accesorio/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findById(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/informacion-categoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findWithModel(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/listar-cate-accesorio-b/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(IdFabricanteAccesorio: number, NombreCategoriaAccesorio: string): Observable<any> {
    let params = new HttpParams()
        .set('IdFabricanteAccesorio', IdFabricanteAccesorio.toString())  
        .set('NombreCategoriaAccesorio', NombreCategoriaAccesorio); 

    return this.httpClient.post(this.apiURL + '/catesubcate-accesorios/ingresar-categoria-accesorio/', null, { params, ...this.httpOptions })
      .pipe(
        catchError(this.errorHandler)
      )      
  }

  eliminar(Id: string): Observable<any> { 
    return this.httpClient.put(this.apiURL + '/catesubcate-accesorios/categoria-eliminar-accesorio/' + Id, this.httpOptions)
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
