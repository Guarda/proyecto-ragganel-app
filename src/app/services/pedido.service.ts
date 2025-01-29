import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiURL = "http://localhost:3000";


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }


  getAll(): Observable<any> {
    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/pedidos/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/pedidos/listar/' + id)
      .pipe(
        catchError(this.errorHandler)
      )

  }

  getArticlesbyOrderId(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/pedidos/listar-articulos/' + id)
      .pipe(
        catchError(this.errorHandler)
      )

  }

  create(producto: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/pedidos/crear-pedido/', JSON.stringify(producto), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  update(pedido: any): Observable<any> {
    return this.httpClient.put(this.apiURL + '/pedidos/actualizar-pedido/' + pedido.CodigoPedido, JSON.stringify(pedido), {
      headers: this.httpOptions.headers,
      responseType: 'json'  // 🔥 Esto evita el error de parseo
    })
      .pipe(
        catchError(this.errorHandler)
      )      
  }

  

  updateArticulos(pedido: any): Observable<any> {
    // Extraer solo los artículos del pedido
    const articulos = pedido.articulos;
  
    console.log("Artículos a enviar:", articulos);  // Esto es solo para debug
  
    return this.httpClient.post(this.apiURL + '/pedidos/actualizar-o-agregar-articulos/', pedido, this.httpOptions)
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
