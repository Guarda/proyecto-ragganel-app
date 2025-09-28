import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeloDistribucion } from '../paginas/interfaces/modelodistribucion';


@Injectable({
  providedIn: 'root'
})
export class CostDistributionService {
  private apiUrl = '/api/cost-distribution'; // Usamos la ruta relativa gracias al proxy

  constructor(private http: HttpClient) { }

  getModelos(idPedido: string): Observable<ModeloDistribucion[]> {
    return this.http.get<ModeloDistribucion[]>(`${this.apiUrl}/${idPedido}`);
  }

  saveDistribucion(distribuciones: any[]): Observable<any> {
    return this.http.post(this.apiUrl, distribuciones);
  }
}