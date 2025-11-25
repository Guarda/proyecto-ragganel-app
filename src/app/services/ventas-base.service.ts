import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Import HttpParams

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../paginas/interfaces/usuarios';
import { Cliente } from '../paginas/interfaces/clientes';
import { VentaFinalData } from '../paginas/interfaces/ventafinal';
import { VentaCompletaResponse } from '../paginas/interfaces/ventacompletaresponse';
import { ProformaResponse } from '../paginas/interfaces/proformaresponse';

@Injectable({
  providedIn: 'root'
})
export class VentasBaseService {

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

  // MÉTODO CORREGIDO
  agregarArticuloAlCarrito(datos: {
    IdUsuario: number,
    IdCliente: number,
    TipoArticulo: string,
    CodigoArticulo: string,
    PrecioVenta: number,
    Descuento: number,
    Cantidad: number,
    // --- CAMPOS AÑADIDOS Y CORREGIDOS ---
    PrecioBaseOriginal: number,
    MargenAplicado: number,
    IdMargenFK: number | null // Acepta el ID del margen
  }): Observable<any> {
    console.log("agregarArticuloAlCarrito con datos completos:", datos);
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

    // CAMBIO CLAVE: Se crea un objeto HttpParams para la URL.
    const params = new HttpParams()
      .set('IdUsuario', datos.IdUsuario.toString())
      .set('IdCliente', datos.IdCliente.toString())
      .set('TipoArticulo', datos.TipoArticulo)
      .set('CodigoArticulo', datos.CodigoArticulo);

    // console.log("[VentasBaseService] Realizando DELETE a", url, "con params:", params.toString());

    // El método .delete() envía los parámetros en la URL.
    return this.httpClient.delete(url, { params: params, headers: this.httpOptions.headers })
      .pipe(catchError(this.errorHandler));
  }

  finalizarVenta(ventaData: VentaFinalData): Observable<any> {
    const url = `${this.apiURL}/ventas-base/finalizar`;
    console.log('[VentasBaseService] Finalizando venta con datos:', ventaData);
    return this.httpClient.post(url, ventaData, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }
  
  eliminarProforma(idProforma: number): Observable<any> {
    const url = `${this.apiURL}/ventas-base/proforma/${idProforma}`;
    console.log(`[VentasBaseService] Eliminando proforma desde: ${url}`);

    // Se utiliza el método .delete() para esta operación.
    return this.httpClient.delete(url, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  getProformaDetails(idProforma: number): Observable<ProformaResponse> {
    const url = `${this.apiURL}/ventas-base/proforma/${idProforma}`;
    console.log(`[VentasBaseService] Solicitando detalles de proforma desde: ${url}`);

    // Realiza una petición GET y espera una respuesta que coincida con la interfaz ProformaResponse.
    return this.httpClient.get<ProformaResponse>(url, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  actualizarDetalleCarrito(datos: {
    IdUsuario: number,
    IdCliente: number,
    TipoArticulo: string,
    CodigoArticulo: string,
    Descuento: number,
    SubtotalSinIVA: number
  }): Observable<any> {
    const url = `${this.apiURL}/ventas-base/carrito/actualizar-detalle`;
    console.log("[VentasBaseService] Actualizando detalle del carrito con datos:", datos);
    return this.httpClient.post(url, datos, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  getVentaCompleta(idVenta: number): Observable<VentaCompletaResponse> {
    const url = `${this.apiURL}/ventas-base/venta-completa/${idVenta}`;
    console.log(`[VentasBaseService] Solicitando venta completa desde: ${url}`);

    // Realiza una petición GET a la nueva ruta y espera una respuesta
    // que coincida con la interfaz VentaCompletaResponse.
    return this.httpClient.get<VentaCompletaResponse>(url, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  listarMotivosNotaCredito(): Observable<any> {
    const url = `${this.apiURL}/ventas-base/motivos-nota-credito`; // Asegúrate de crear este endpoint en tu backend
    return this.httpClient.get(url, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: any) {
    let errorMessage = 'Ocurrió un error inesperado al procesar tu solicitud.'; // Mensaje genérico

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente/red (poco probable con CORS bien configurado)
      errorMessage = 'Error de red: no se pudo conectar con el servidor.';
    } else {
      // Error del lado del servidor (4xx o 5xx)

      // Caso 1: Error 400 con mensaje de negocio limpio (ej: Stock insuficiente)
      if (error.status === 400 && error.error && error.error.error) {
        // Tu backend lo devuelve como: { success: false, error: "Stock insuficiente..." }
        errorMessage = error.error.error;
      }
      // Caso 2: Error 500 interno (usar el mensaje genérico)
      else if (error.status === 500) {
        // Si el servidor envía un dbError (Stack Trace), lo logueamos pero no lo mostramos al usuario.
        console.error('Error 500 detectado. Detalles:', error);
        errorMessage = 'Hubo un fallo interno en el servidor. Intenta de nuevo más tarde.';
      } 
      // Caso 3: Otros errores HTTP (404, 403, etc.)
      else {
        console.error(`Error HTTP ${error.status} detectado. Detalles:`, error);
        errorMessage = `Error de comunicación (${error.status}). Verifica tu conexión.`;
      }
    }
    
    // Devolvemos el mensaje limpio a la suscripción.
    return throwError(() => errorMessage);
  }
}