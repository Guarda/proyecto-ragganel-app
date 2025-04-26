import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriaInsumoService {
  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/listar-cate-insumos/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getAllBase(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/listar-cate-insumos-b/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/listar-cate-insumos/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findById(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/informacion-categoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findWithModel(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/listar-cate-insumos-b/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(IdFabricanteInsumo: number, NombreCategoriaInsumo: string): Observable<any> {
    let params = new HttpParams()
        .set('IdFabricanteInsumo', IdFabricanteInsumo.toString())  
        .set('NombreCategoriaInsumo', NombreCategoriaInsumo); 

    return this.httpClient.post(this.apiURL + '/catesubcate-insumos/ingresar-categoria-insumos/', null, { params, ...this.httpOptions })
      .pipe(
        catchError(this.errorHandler)
      )      
  }

  eliminar(Id: string): Observable<any> { 
    return this.httpClient.put(this.apiURL + '/catesubcate-insumos/categoria-eliminar-insumos/' + Id, this.httpOptions)
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

