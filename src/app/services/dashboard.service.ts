import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Kpis } from '../paginas/interfaces/kpis';
import { ChartData } from '../paginas/interfaces/chartdata';
import { UltimaVenta } from '../paginas/interfaces/ultimaventa';
import { StockBajo } from '../paginas/interfaces/stockbajo';
import { DashboardData } from '../paginas/interfaces/dashboarddata';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiURL = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  getDashboardData(): Observable<{ success: boolean, data: DashboardData }> {
    return this.httpClient.get<{ success: boolean, data: DashboardData }>(`${this.apiURL}/dashboard`)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  private errorHandler(error: any) {
    console.error('Error en el servicio del dashboard:', error);
    return throwError(() => new Error('Ocurrió un error al obtener los datos del dashboard.'));
  }
}