import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriasAccesoriosBase } from '../paginas/interfaces/categoriasaccesoriosbase';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CategoriasAccesoriosService {
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
    return this.httpClient.get(this.apiURL + '/accesorios-base/listar-categorias-accesorios/')
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

  checkCombinationExists(fab: string, cat: string, sub: string): Observable<any> {
    const params = new HttpParams()
      .set('fab', fab)
      .set('cat', cat)
      .set('sub', sub);

    // Llama al endpoint de 'categories-accesories.js'
    return this.httpClient.get(this.apiURL + '/categorias-accesorios/check-exists', { params: params })
      .pipe(
        catchError(this.errorHandler) // Añadido para consistencia
      );
  }
  
  getbymanufacturer(fabricante: number, categoria: number, subcategoria: number): Observable<any> {
    
    console.log('reached');
    let params = new HttpParams()
    .set('Fabricante', fabricante)
    .set('Categoria', categoria)
    .set('Subcategoria', subcategoria);

    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/accesorios-base/categoria/', {params})
      .pipe(
        catchError(this.errorHandler)
      )
  }

  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/accesorios-base/categoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(categoria: CategoriasAccesoriosBase): Observable<any> {
    return this.httpClient.post(this.apiURL + '/categorias-accesorios/crear-categoria-accesorio/', JSON.stringify(categoria), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  update(categoria: CategoriasAccesoriosBase): Observable<any> {
    return this.httpClient.put(this.apiURL + '/categorias-accesorios/categoria/' + categoria.IdModeloAccesorioPK, JSON.stringify(categoria), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  
  eliminar(categoria: CategoriasAccesoriosBase): Observable<any> {   
    console.log(categoria) 
    return this.httpClient.put(this.apiURL + '/categorias-accesorios/categoria-eliminar/' + categoria.IdModeloAccesorioPK, JSON.stringify(categoria), this.httpOptions)
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
