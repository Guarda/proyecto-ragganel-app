import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListadoArticulosVentaService {
  private insumosSubject = new BehaviorSubject<any[]>([]);
  insumos$: Observable<any[]> = this.insumosSubject.asObservable();

  private apiURL = "http://localhost:3000"; // Cambia esta URL según tu configuración

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  // Obtener todos los insumos
  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/articulo-lista/')
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
