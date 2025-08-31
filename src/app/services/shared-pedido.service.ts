import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedPedidoService {

  /**
   * Este BehaviorSubject es la única fuente de verdad para el subtotal de los artículos.
   * El componente 'index-listado-articulos' enviará actualizaciones aquí.
   * El componente 'agregar-pedido' se suscribirá para recibir estas actualizaciones.
   */
  private subTotalArticulosSubject = new BehaviorSubject<number>(0);

  /**
   * Exponemos el subtotal como un Observable para que los componentes puedan suscribirse
   * de forma segura (solo pueden leer, no modificar el valor directamente).
   */
  public SubTotalArticulosPedido$ = this.subTotalArticulosSubject.asObservable();

  constructor() { }

  /**
   * Método público que el componente 'index-listado-articulos' usará para
   * actualizar el valor del subtotal cada vez que se agregue, elimine o
   * modifique la cantidad de un artículo.
   *
   * @param nuevoSubtotal El nuevo valor del subtotal calculado en el listado de artículos.
   */
  public subtotalarticulosPedido(nuevoSubtotal: number): void {
    this.subTotalArticulosSubject.next(nuevoSubtotal || 0);
  }
}