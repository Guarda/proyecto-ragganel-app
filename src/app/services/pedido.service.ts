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

  getOrderStateLog(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/pedidos/historial-pedido/' + id)
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

  cancelar(idpedido: any): Observable<any> {
    // console.log(producto)
    return this.httpClient.put(this.apiURL + '/pedidos/cancelar-pedido/' + idpedido, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  eliminar(idpedido: any): Observable<any> {
    // console.log(producto)
    return this.httpClient.put(this.apiURL + '/pedidos/eliminar-pedido/' + idpedido, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  avanzar(idpedido: any): Observable<any> {
    // console.log(producto)
    return this.httpClient.put(this.apiURL + '/pedidos/avanzar-pedido/' + idpedido, this.httpOptions)
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

  ingresarInventario(pedido: any): Observable<any> {
    const requestBody = {
      idPedido: pedido.idPedido,
      productos: pedido.productos, // Cambiado de `productosData` a `productos`
      accesorios: pedido.accesorios, // Cambiado de `accesoriosData` a `accesorios`
      insumos: pedido.insumos // Asegurar que también se envíen los insumos si existen
    };
  
    console.log("Inventario a enviar:", requestBody); // Debug
  
    return this.httpClient.post(this.apiURL + '/pedidos/ingresar-inventario/', requestBody, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }
  
  getReporteIngreso(id: string): Observable<any> {
    // ✅ CORREGIDO: Se arregló el typo en la URL ("ingreso" en lugar de "ignreso")
    // y se eliminó el responseType: 'blob' para que espere JSON.
    return this.httpClient.get(this.apiURL + '/pedidos/reporte-ingreso/' + id)
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
