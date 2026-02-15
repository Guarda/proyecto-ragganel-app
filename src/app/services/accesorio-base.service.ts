import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccesoriosBase } from '../paginas/interfaces/accesoriosbase';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AccesorioBaseService {
  private accessoriesSubject = new BehaviorSubject<any[]>([]);
  accessories$: Observable<any[]> = this.accessoriesSubject.asObservable();

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
    return this.httpClient.get(this.apiURL + '/accesorios-base/')
      .pipe(
        catchError(this.errorHandler)
      )
  }



  create(producto: AccesoriosBase): Observable<any> {
    return this.httpClient.post(this.apiURL + '/accesorios-base/crear-accesorio/', JSON.stringify(producto), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/accesorios-base/accesorio/' + id)
      .pipe(
        catchError(this.errorHandler)
      )

  }

  update(accesorio: AccesoriosBase): Observable<any> {
    return this.httpClient.put(this.apiURL + '/accesorios-base/accesorio/' + accesorio.CodigoAccesorio, JSON.stringify(accesorio), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  actualizarEstado(codigo: string, nuevoEstadoId: number, IdUsuario: number): Observable<any> {
    const body = {
      tipoArticulo: 'Accesorio',
      codigoArticulo: codigo,
      nuevoEstadoId: nuevoEstadoId,
      IdUsuario: IdUsuario // Se añade el IdUsuario al cuerpo de la petición
    };
    return this.httpClient.post(`${this.apiURL}/inventario/cambiar-estado`, body, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // ✅ ==================== INICIO DE LA CORRECCIÓN ====================
  eliminar(data: { CodigoAccesorio: string; IdUsuario: number }): Observable<any> {   
    // El cuerpo de la petición (el segundo argumento del método put) ahora es el objeto 'data'
    // que contiene tanto el CodigoAccesorio como el IdUsuario.
    return this.httpClient.put(this.apiURL + '/accesorios-base/accesorio-eliminar/' + data.CodigoAccesorio, data, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }
  // ✅ ===================== FIN DE LA CORRECCIÓN ======================

  getAccesoriosStateLog(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/accesorios-base/historial-accesorio/' + id)
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
    return throwError(() => new Error(errorMessage));
  }
}
