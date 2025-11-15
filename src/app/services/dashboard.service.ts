import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardData } from '../paginas/interfaces/dashboarddata';
import { ChartData } from '../paginas/interfaces/chartdata';
import { Top10Articulo } from '../paginas/interfaces/top10articulo';
import { PedidoDashboardItem } from '../paginas/interfaces/pedidodashboarditem';
// ===== NUEVA INTERFAZ (O MUEVELA A TU ARCHIVO DE INTERFACES) =====



@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiURL = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  getDashboardData(): Observable<{ success: boolean; data: DashboardData; }> {
    return this.httpClient.get<{ success: boolean, data: DashboardData }>(`${this.apiURL}/dashboard/`)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  getVentasGrafico(inicio: string, fin: string): Observable<ChartData[]> {
    return this.httpClient.get<ChartData[]>(`${this.apiURL}/dashboard/ventas-grafico?inicio=${inicio}&fin=${fin}`,)
      .pipe(
        catchError(this.errorHandler)
      );
  }
  
  // ===== NUEVO MÉTODO =====
  /**
   * Obtiene el Top 10 de artículos para el desglose del gráfico ABC.
   * @param categoria El nombre de la sección del gráfico (ej. 'A (Productos) (85 arts.)')
   */
  getTop10ArticulosABC(categoria: string): Observable<Top10Articulo[]> {
    // encodeURIComponent es importante por si el nombre tiene caracteres especiales
    const encodedCategoria = encodeURIComponent(categoria);
    
    return this.httpClient.get<Top10Articulo[]>(`${this.apiURL}/dashboard/top10-abc?categoria=${encodedCategoria}`)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  getDescargaInventarioABC(categoria: string): Observable<Top10Articulo[]> {
    const encodedCategoria = encodeURIComponent(categoria);
    
    // Llama a la nueva ruta del backend
    return this.httpClient.get<Top10Articulo[]>(`${this.apiURL}/dashboard/descargar-abc?categoria=${encodedCategoria}`)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  getPedidosDashboard(diasAlerta: number): Observable<PedidoDashboardItem[]> {
    // Usamos HttpParams para enviar el parámetro de forma segura
    const params = new HttpParams().set('diasAlerta', diasAlerta.toString());

    return this.httpClient.get<PedidoDashboardItem[]>(`${this.apiURL}/dashboard/pedidos`, { params })
      .pipe(
        catchError(this.errorHandler)
      );
  }

  private errorHandler(error: any) {
    let errorMessage = 'Ocurrió un error desconocido.';
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    return throwError(() => new Error(errorMessage));
  }
}