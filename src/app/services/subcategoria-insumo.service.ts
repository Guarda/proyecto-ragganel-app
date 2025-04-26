import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaInsumoService {
  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/listar-subcate-insumos/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/listar-subcate-insumos/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findById(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/informacion-subcategoria/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findBase(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/listar-subcate-insumos-b/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  findWithModel(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/catesubcate-insumos/listar-subcate-insumos-c/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(IdCategoriaInsumo: number, NombreSubCategoriaInsumo: string): Observable<any> {
    let params = new HttpParams()
      .set('IdCategoriaInsumo', IdCategoriaInsumo.toString())
      .set('NombreSubCategoriaInsumo', NombreSubCategoriaInsumo);

    return this.httpClient.post(this.apiURL + '/catesubcate-insumos/ingresar-subcategoria-insumos/', null, { params, ...this.httpOptions })
      .pipe(
        catchError(this.errorHandler)
      )
  }

  eliminar(Id: string): Observable<any> {
    console.log('sent:' + Id);
    return this.httpClient.put(this.apiURL + '/catesubcate-insumos/subcategoria-eliminar-insumos/' + Id, this.httpOptions)
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