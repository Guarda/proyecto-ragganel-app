import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from '../interfaces/producto';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$: Observable<any[]> = this.productsSubject.asObservable();


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
    return this.httpClient.get(this.apiURL + '/productos/')
      .pipe(
        catchError(this.errorHandler)
      )
  }


  /**
   * Write code on Method
   *
   * @return response()
   */

  create(producto: Producto): Observable<any> {
    return this.httpClient.post(this.apiURL + '/productos/crear-producto/', JSON.stringify(producto), this.httpOptions)
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
    return this.httpClient.get(this.apiURL + '/productos/producto/' + id)
      .pipe(
        catchError(this.errorHandler)
      )

  }


  /**

  * Write code on Method

  *

  * @return response()

  */

  update(producto: Producto): Observable<any> {
    return this.httpClient.put(this.apiURL + '/productos/producto/' + producto.CodigoConsola, JSON.stringify(producto), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  actualizarEstado(codigo: string, nuevoEstadoId: number, IdUsuario: number): Observable<any> {
    const body = {
      tipoArticulo: 'Producto',
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
  eliminar(data: { CodigoConsola: string; IdUsuario: number }): Observable<any> {   
    // El primer parámetro del método PUT es la URL.
    // El segundo parámetro es el CUERPO (body) de la petición.
    // El tercer parámetro son las opciones (headers).
    return this.httpClient.put(this.apiURL + '/productos/producto-eliminar/' + data.CodigoConsola, data, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }
  // ✅ ===================== FIN DE LA CORRECCIÓN ======================

  getProductStateLog(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/productos/historial-producto/' + id)
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
    return throwError(() => new Error(errorMessage)); // Corregido para la versión moderna de RxJS
  }

}
