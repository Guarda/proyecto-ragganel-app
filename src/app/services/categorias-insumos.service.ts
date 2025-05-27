import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriasInsumosBase } from '../paginas/interfaces/categoriasinsumosbase';

@Injectable({
  providedIn: 'root'
})
export class CategoriasInsumosService {
  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/insumos-base/listar-categorias-insumos/')
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
  
  getbymanufacturer(fabricante: number, categoria: number, subcategoria: number): Observable<any> {
    let params = new HttpParams()
      .set('Fabricante', fabricante)
      .set('Categoria', categoria)
      .set('Subcategoria', subcategoria);

    return this.httpClient.get(this.apiURL + '/insumos-base/categoria/', { params })
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getbymanufacturerb(fabricante: number, categoria: number, subcategoria: number): Observable<any> {
    let params = new HttpParams()
      .set('Fabricante', fabricante)
      .set('Categoria', categoria)
      .set('Subcategoria', subcategoria);

    return this.httpClient.get(this.apiURL + '/insumos-base/categoria-b/', { params })
      .pipe(
        catchError(this.errorHandler)
      )
  }

  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/insumos-base/categoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

   findb(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/insumos-base/categoria-b/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(categoria: CategoriasInsumosBase): Observable<any> {
    return this.httpClient.post(this.apiURL + '/categorias-insumos/crear-categoria-insumos/', JSON.stringify(categoria), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  update(categoria: CategoriasInsumosBase): Observable<any> {
    return this.httpClient.put(this.apiURL + '/categorias-insumos/categoria/' + categoria.IdModeloInsumosPK, JSON.stringify(categoria), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  eliminar(categoria: CategoriasInsumosBase): Observable<any> {   
    return this.httpClient.put(this.apiURL + '/categorias-insumos/categoria-eliminar/' + categoria.IdModeloInsumosPK, JSON.stringify(categoria), this.httpOptions)
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