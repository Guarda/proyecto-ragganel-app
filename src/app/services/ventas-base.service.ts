import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Import HttpParams

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../paginas/interfaces/usuarios';
import { Cliente } from '../paginas/interfaces/clientes';

@Injectable({
  providedIn: 'root'
})
export class VentasBaseService {
  // This line seems to be a leftover or placeholder, you might want to remove it
  finalizarVenta(ventaData: { IdUsuarioFK: number; IdClienteFK: number; IdMetodoPagoFK: number; IdMargenVentaFK: number | null; TotalVentaSinIVA: number; IVA: number; TotalVentaConIVA: number; NumeroReferenciaTransferencia: string | null; ObservacionesOtrosMetodoPago: string | null; }) {
    throw new Error('Method not implemented.');
  }
  private accessoriesSubject = new BehaviorSubject<any[]>([]);

  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  IngresarVenta(venta: any): Observable<any> {
    return this.httpClient.post(this.apiURL + '/ventas-base/ingresar-venta', JSON.stringify(venta), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  ListarTodosLosMargenesVenta(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/ventas-base/margenes-venta')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  ListarTodosLosMetodosDePago(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/ventas-base/metodos-de-pago')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  listarVentasPorUsuario(usuario: Usuarios): Observable<any> {
    const url = `${this.apiURL}/ventas-base/listado-ventas/${usuario.id}`;
    return this.httpClient.get(url, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  listarCarritoVentaUsuarioXClienteEnCurso(usuario: Usuarios, cliente: Cliente) {
    console.log("listarCarritoVentaUsuarioXClienteEnCurso", usuario, cliente);
    const params = {
      IdUsuario: usuario.id,
      IdCliente: cliente.id
    };

    return this.httpClient.get<any[]>(`${this.apiURL}/ventas-base/listar-carrito-en-curso-cliente-usuario`, { params })
      .pipe(catchError(this.errorHandler));
  }

  agregarArticuloAlCarrito(datos: {
    IdUsuario: number,
    IdCliente: number,
    TipoArticulo: string,
    CodigoArticulo: string,
    PrecioVenta: number,
    Descuento: number,
    SubtotalSinIVA: number,
    Cantidad: number
  }): Observable<any> {
    console.log("agregarArticuloAlCarrito", datos);
    return this.httpClient.post(this.apiURL + '/ventas-base/agregar-al-carrito', datos, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  limpiarCarritoDeVentas(idUsuario: number, idCliente: number): Observable<any> {
    const url = `${this.apiURL}/ventas-base/limpiar-carrito`;

    // CAMBIO: Renombramos 'params' a 'body' para que sea más claro.
    const body = {
      IdUsuario: idUsuario,
      IdCliente: idCliente
    };

    console.log(`[VentasBaseService] Realizando POST a ${url} con body:`, body);

    // CAMBIO CLAVE: Pasamos el objeto 'body' directamente, sin envolverlo en { params }.
    return this.httpClient.post(url, body, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  eliminarArticuloDelCarrito(datos: {
    IdUsuario: number,
    IdCliente: number,
    TipoArticulo: string,
    CodigoArticulo: string
  }): Observable<any> {
    console.log("eliminarArticuloDelCarrito", datos);
    return this.httpClient.post(this.apiURL + '/ventas-base/eliminar-linea-del-carrito', datos, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  disminuirArticuloDelCarrito(datos: {
    IdUsuario: number,
    IdCliente: number,
    TipoArticulo: string,
    CodigoArticulo: string
  }): Observable<any> {
    const url = `${this.apiURL}/ventas-base/eliminar-del-carrito`;

    // Para enviar un body con una petición DELETE, se debe poner dentro de las opciones.
    const options = {
      headers: this.httpOptions.headers,
      body: datos
    };

    console.log("[VentasBaseService] Realizando DELETE a", url, "con body:", datos);

    return this.httpClient.delete(url, options)
      .pipe(catchError(this.errorHandler));
  }

  /**
   * Clears the entire shopping cart for a specific user and client in the backend.
   * This method sends a request to your backend API to remove all items from the current cart session.
   * @param idUsuario The ID of the user whose cart is to be cleared.
   * @param idCliente The ID of the client associated with the cart.
   * @returns An Observable that emits the backend's response (e.g., success status).
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