import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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

  findById(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate/informacion-subcategoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findBase(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate/listar-subcate-b/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findWithModel(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate/listar-subcate-c/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }


  create(IdCategoria: number, NombreSubCategoria: string): Observable<any> {
    let params = new HttpParams()
      .set('IdCategoria', IdCategoria.toString())
      .set('NombreSubCategoria', NombreSubCategoria);

    return this.httpClient.post(this.apiURL + '/catesubcate/ingresar-subcategoria/', null, { params, ...this.httpOptions })
      .pipe(
        catchError(this.errorHandler)
      )
  }

  eliminar(Id: string): Observable<any> {
    return this.httpClient.put(this.apiURL + '/catesubcate/subcategoria-eliminar/' + Id, this.httpOptions)
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
