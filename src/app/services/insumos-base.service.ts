import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InsumosBase } from '../paginas/interfaces/insumosbase';
import { InsumoEliminarData } from '../paginas/interfaces/insumoeliminardata';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class InsumosBaseService {
  private insumosSubject = new BehaviorSubject<any[]>([]);
  insumos$: Observable<any[]> = this.insumosSubject.asObservable();

  private apiURL = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) {}

  // Obtener todos los insumos
  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/insumos-base/')
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // Crear un nuevo insumo
  create(insumo: InsumosBase): Observable<any> {
    return this.httpClient.post(this.apiURL + '/insumos-base/crear-insumo/', JSON.stringify(insumo), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // Buscar un insumo por ID
  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/insumos-base/insumo/' + id)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // Actualizar un insumo existente
  update(insumo: InsumosBase): Observable<any> {
    return this.httpClient.put(this.apiURL + '/insumos-base/insumo/' + insumo.CodigoInsumo, JSON.stringify(insumo), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // Eliminar un insumo (lógica de eliminación)
  eliminar(data: InsumoEliminarData): Observable<any> { // Change parameter type
  console.log('Data being sent to delete:', data); 
  return this.httpClient.put(this.apiURL + '/insumos-base/insumo-eliminar/' + data.CodigoInsumo, JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
} 

  // Obtener el historial de cambios de un insumo
  getInsumosStateLog(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/insumos-base/historial-insumo/' + id)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // Manejo de errores
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
