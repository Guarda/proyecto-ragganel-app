import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosExtrasPedidoService {
  
  private dataTotalCostoPedido = new BehaviorSubject<number>(0);  
  TotalCostoPedido$: Observable<number> = this.dataTotalCostoPedido.asObservable();

  constructor() {}

  // Método para actualizar el costo total del pedido
  actualizarTotalCostoPedido(nuevoCosto: number): void {
    console.log('Actualizando TotalCostoPedido:', nuevoCosto);
    this.dataTotalCostoPedido.next(nuevoCosto);
  }

  // Método para obtener el valor actual sin suscribirse
  obtenerTotalCostoPedido(): number {
    return this.dataTotalCostoPedido.getValue();
  }

  // Método para restablecer el costo total
  resetearTotalCostoPedido(): void {
    this.dataTotalCostoPedido.next(0);
  }
}