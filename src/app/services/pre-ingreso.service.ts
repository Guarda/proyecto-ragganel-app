import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreIngresoService {
  // Se define la URL completa, siguiendo el patrón de los otros servicios.
  private apiUrl = `http://localhost:3000/api/pre-ingreso`;

  constructor(private http: HttpClient) { }

  /**
   * Guarda el estado de un formulario de producto.
   */
  saveProduct(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/producto`, payload).pipe(
      tap({
        next: (res) => console.log('Respuesta de guardado de producto:', res),
        error: (err) => console.error('Error en guardado de producto:', err)
      })
    );
  }

  // Guarda el estado de un formulario de accesorio
  saveAccessory(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/accesorio`, payload).pipe(
      tap({
        next: (res) => console.log('Respuesta de guardado de accesorio:', res),
        error: (err) => console.error('Error en guardado de accesorio:', err)
      })
    );
  }

  // Guarda el estado de un formulario de insumo
  saveSupply(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/insumo`, payload).pipe(
      tap({
        next: (res) => console.log('Respuesta de guardado de insumo:', res),
        error: (err) => console.error('Error en guardado de insumo:', err)
      })
    );
  }

  /**
   * Carga los datos de productos pre-guardados para un pedido y usuario.
   */
  loadProducts(pedidoId: string, usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/${pedidoId}/${usuarioId}`);
  }
  // Carga los accesorios pre-guardados para un pedido y usuario
  loadAccessories(pedidoId: string, usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/accesorios/${pedidoId}/${usuarioId}`);
  }

  // Carga los insumos pre-guardados para un pedido y usuario
  loadSupplies(pedidoId: string, usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/insumos/${pedidoId}/${usuarioId}`);
  }

  /**
   * Elimina todos los datos temporales de un pedido para un usuario.
   */
  deletePreIngresoData(pedidoId: string, usuarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${pedidoId}/${usuarioId}`);
  }
  // Método para cargar todos los datos de pre-ingreso en paralelo
  loadAllPreIngresoData(pedidoId: string, usuarioId: number): Observable<[any, any, any]> {
    const products$ = this.loadProducts(pedidoId, usuarioId);
    const accessories$ = this.loadAccessories(pedidoId, usuarioId);
    const supplies$ = this.loadSupplies(pedidoId, usuarioId);
    return forkJoin([products$, accessories$, supplies$]);
  }
}
