import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TareasProductosService {
  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/tareas/tareas/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  update(idtarea: number, rvalue: number): Observable<any> {
    let params = new HttpParams()
        .set('IdTareaPK', idtarea.toString())  // Ensure the parameter is a string
        .set('RealizadoValue', rvalue ? '1' : '0'); // Convert boolean to string '1' or '0'

    return this.httpClient.put(this.apiURL + '/tareas/tareas/', null, { params, ...this.httpOptions })
        .pipe(
            catchError(this.errorHandler)
        );
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
