import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaAccesorioService {
  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/listar-subcate-accesorio/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/listar-subcate-accesorio/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findById(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/informacion-subcategoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findBase(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/listar-subcate-accesorio-b/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  
  findWithModel(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-accesorios/listar-subcate-accesorio-c/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(IdCategoriaAccesorio: number, NombreSubCategoriaAccesorio: string): Observable<any> {
    let params = new HttpParams()
      .set('IdCategoriaAccesorio', IdCategoriaAccesorio.toString())
      .set('NombreSubCategoriaAccesorio', NombreSubCategoriaAccesorio);

    return this.httpClient.post(this.apiURL + '/catesubcate-accesorios/ingresar-subcategoria-accesorio/', null, { params, ...this.httpOptions })
      .pipe(
        catchError(this.errorHandler)
      )
  }

  eliminar(Id: string): Observable<any> {
    console.log('sent:'+Id);
    return this.httpClient.put(this.apiURL + '/catesubcate-accesorios/subcategoria-eliminar-accesorio/' + Id, this.httpOptions)
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
