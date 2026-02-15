import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardData } from '../paginas/interfaces/dashboarddata';
import { ChartData } from '../paginas/interfaces/chartdata';
import { Top10Articulo } from '../paginas/interfaces/top10articulo';
import { PedidoDashboardItem } from '../paginas/interfaces/pedidodashboarditem';
import { PronosticoData } from '../paginas/interfaces/pronosticodata';
import { PronosticoGraficoItem } from '../paginas/interfaces/pronosticodatoitem';
import { PronosticoResponse } from '../paginas/interfaces/pronosticoresponse';
import { ReportePronosticoMasivoItem } from '../paginas/interfaces/reportepronosticomasivoitem';
import { environment } from '../../enviroments/enviroments';
// ===== NUEVA INTERFAZ (O MUEVELA A TU ARCHIVO DE INTERFACES) =====
export interface ModeloPronostico {
  IdModelo: number;
  TipoArticulo: number;
  NombreModelo: string;
}
// =================================================================


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiURL = environment.apiUrl;

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

  // ===== INICIO DEL NUEVO MÉTODO (LISTA DE MODELOS) =====
  /**
   * Obtiene la lista unificada de todos los modelos (supercategorías)
   * de productos, accesorios e insumos para el pronóstico.
   */
  getModelosParaPronostico(): Observable<ModeloPronostico[]> {
    return this.httpClient.get<ModeloPronostico[]>(`${this.apiURL}/dashboard/modelos-pronostico`)
      .pipe(
        catchError(this.errorHandler)
      );
  }
  // ===== FIN DEL NUEVO MÉTODO =====


  getPronosticoPorModelo(idModelo: number, tipoArticulo: number, mesesHistorial: number): Observable<PronosticoResponse> {
    
    // Usamos HttpParams para enviar los parámetros de forma limpia y segura
    let params = new HttpParams()
      .set('idModelo', idModelo.toString())
      .set('tipoArticulo', tipoArticulo.toString())
      .set('mesesHistorial', mesesHistorial.toString());

    // El tipo esperado de la respuesta del backend
    type BackendResponse = [PronosticoData[], PronosticoGraficoItem[]];

    // El backend devolverá un array de dos arrays: [ [Resumen], [DatosGrafico] ]
    // Usamos 'map' de RxJS para transformar esta respuesta en nuestro objeto 'PronosticoResponse'.
    return this.httpClient.get<BackendResponse>(`${this.apiURL}/dashboard/pronostico-modelo`, { params })
      .pipe(
        // Añadimos el tipo explícito 'BackendResponse' al parámetro 'response'
        map((response: BackendResponse) => {
          // El SP devuelve el resumen en response[0][0] y la gráfica en response[1]
          if (!response || !response[0] || !response[0][0]) {
            throw new Error('Respuesta inesperada del servidor al obtener pronóstico.');
          }
          return {
            resumen: response[0][0], // El primer elemento del primer array
            grafico: response[1]      // El segundo array completo
          };
        }),
        catchError(this.errorHandler)
      );
  }

  getReportePronosticoMasivo(mesesHistorial: number): Observable<ReportePronosticoMasivoItem[]> {
    let params = new HttpParams()
      .set('mesesHistorial', mesesHistorial.toString());

    return this.httpClient.get<ReportePronosticoMasivoItem[]>(`${this.apiURL}/dashboard/reporte-pronostico-masivo`, { params })
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