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

  /**
   * Clears the entire shopping cart for a specific user and client in the backend.
   * This method sends a request to your backend API to remove all items from the current cart session.
   * @param idUsuario The ID of the user whose cart is to be cleared.
   * @param idCliente The ID of the client associated with the cart.
   * @returns An Observable that emits the backend's response (e.g., success status).
   */
  limpiarCarritoDeVentas(idUsuario: number, idCliente: number): Observable<any> {
    // You'll need to define an appropriate endpoint in your backend for this operation.
    // A POST request with IDs in the body, or a DELETE with IDs as query params/body are common.
    // For simplicity and common REST practices, a POST request is often used for actions.
    // If your backend expects a DELETE, adjust accordingly.
    const url = `${this.apiURL}/ventas-base/limpiar-carrito`; // Define your backend endpoint for clearing the cart
    const body = { idUsuario, idCliente }; // Send user and client IDs in the request body

    return this.httpClient.post(url, body, this.httpOptions)
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