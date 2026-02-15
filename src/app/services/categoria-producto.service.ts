import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { categoriasProductos } from '../paginas/interfaces/categoriasproductos';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProductoService {
  private apiURL = environment.apiUrl;

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
    return this.httpClient.get(this.apiURL + '/catesubcate/listar-cate/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getAllBase(): Observable<any> {
    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/catesubcate/listar-cate-b/')
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
    return this.httpClient.get(this.apiURL + '/catesubcate/listar-cate/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findById(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate/informacion-categoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findWithModel(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate/listar-cate-b/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(IdFabricante: number, NombreCategoria: string): Observable<any> {
    let params = new HttpParams()
        .set('IdFabricante', IdFabricante.toString())  
        .set('NombreCategoria', NombreCategoria); 

    return this.httpClient.post(this.apiURL + '/catesubcate/ingresar-categoria/', null, { params, ...this.httpOptions })
      .pipe(
        catchError(this.errorHandler)
      )      
  }

  eliminar(Id: string): Observable<any> { 
    return this.httpClient.put(this.apiURL + '/catesubcate/categoria-eliminar/' + Id, this.httpOptions)
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
