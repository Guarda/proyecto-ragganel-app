import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroments';
@Injectable({
  providedIn: 'root'
})
export class FabricanteInsumoService {
  private apiURL = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  /**
   * Get all fabricantes insumos
   *
   * @return Observable<any>
   */
  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/fabricantes-insumos/listar-fabricantes-insumos/')
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * Get all base fabricantes insumos
   *
   * @return Observable<any>
   */
  getAllBase(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/fabricantes-insumos/listar-fabricantes-insumos-b/')
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * Find fabricante insumo by ID
   *
   * @param id string
   * @return Observable<any>
   */
  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/fabricantes-insumos/info-fabricante/' + id)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * Get fabricantes insumos with model
   *
   * @return Observable<any>
   */
  getManufacturerWithModel(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/fabricantes-insumos/listar-fabricantes-insumos-c/')
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * Create a new fabricante insumo
   *
   * @param NombreFabricanteInsumo string
   * @return Observable<any>
   */
  create(NombreFabricanteInsumo: string): Observable<any> {
    const fabricanteData = { NombreFabricanteInsumo }; // Wrap the string in an object
    console.log(fabricanteData);
    return this.httpClient.post(this.apiURL + '/fabricantes-insumos/ingresar-fabricante-insumos/', fabricanteData, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * Delete fabricante insumo by ID
   *
   * @param Id string
   * @return Observable<any>
   */
  eliminar(Id: string): Observable<any> {
    return this.httpClient.put(this.apiURL + '/fabricantes-insumos/fabricante-eliminar-insumos/' + Id, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /**
   * Error handler for HTTP requests
   *
   * @param error any
   * @return Observable<never>
   */
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