import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriasInsumosBase } from '../paginas/interfaces/categoriasinsumosbase';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CategoriasInsumosService {
  private apiURL = environment.apiUrl;

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

  checkCombinationExists(fab: string, cat: string, sub: string): Observable<any> {
    const params = new HttpParams()
      .set('fab', fab)
      .set('cat', cat)
      .set('sub', sub);

    // Llama al endpoint de 'categories-supplies.js'
    return this.httpClient.get(this.apiURL + '/categorias-insumos/check-exists', { params: params })
      .pipe(
        catchError(this.errorHandler) // Añadido para consistencia
      );
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