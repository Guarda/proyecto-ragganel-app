// En: src/app/services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ArticuloVenta } from '../paginas/interfaces/articuloventa';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carrito: ArticuloVenta[] = [];
  private carritoSubject = new BehaviorSubject<ArticuloVenta[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  private solicitarAjusteStockInventarioSubject = new Subject<{ codigoArticulo: string, cantidadDelta: number, tipoArticulo?: string | null }>();
  solicitarAjusteStockInventario$ = this.solicitarAjusteStockInventarioSubject.asObservable();

  private stockTomadoConExitoSubject = new Subject<string>();
  stockTomadoConExito$ = this.stockTomadoConExitoSubject.asObservable();


  private esAgrupableEnCarrito(tipo?: string | null): boolean {
    return tipo === 'Insumo';
  }

  notificarAgregadoAlCarrito(articuloDelInventario: ArticuloVenta, esServicio: boolean): void {
    const articuloCodigo = articuloDelInventario.Codigo!;
    const articuloConDescuentoInicial: ArticuloVenta = {
      ...articuloDelInventario,
      Cantidad: 1,
      DescuentoPorcentaje: 0 // Inicializar descuento en 0
    };

    if (this.esAgrupableEnCarrito(articuloDelInventario.Tipo)) {
      const existenteEnCarrito = this.carrito.find(a => a.Codigo === articuloCodigo);
      if (existenteEnCarrito) {
        existenteEnCarrito.Cantidad = (existenteEnCarrito.Cantidad ?? 0) + 1;
        // Si ya existe, no sobreescribimos su descuento si ya fue modificado.
        // Si es la primera vez que se agrupa, ya tiene el descuento en 0.
      } else {
        this.carrito.push(articuloConDescuentoInicial);
      }
    } else {
      this.carrito.push(articuloConDescuentoInicial);
    }
    this.carritoSubject.next([...this.carrito]);
  }

  // Para botón (+) en el carrito
  solicitarIncrementoCantidad(codigoArticulo: string): void {
    const articuloEnCarrito = this.carrito.find(a => a.Codigo === codigoArticulo);
    if (articuloEnCarrito && this.esAgrupableEnCarrito(articuloEnCarrito.Tipo)) {
      this.solicitarAjusteStockInventarioSubject.next({ codigoArticulo, cantidadDelta: -1, tipoArticulo: articuloEnCarrito.Tipo });
    }
  }

  confirmarIncrementoEnCarrito(codigoArticulo: string): void {
    const articuloEnCarrito = this.carrito.find(a => a.Codigo === codigoArticulo && this.esAgrupableEnCarrito(a.Tipo));
    if (articuloEnCarrito) {
      articuloEnCarrito.Cantidad = (articuloEnCarrito.Cantidad ?? 0) + 1;
      this.carritoSubject.next([...this.carrito]);
    }
  }

  decrementarCantidadEnCarrito(codigoArticulo: string): void {
    const articuloEnCarrito = this.carrito.find(a => a.Codigo === codigoArticulo);
    if (articuloEnCarrito && this.esAgrupableEnCarrito(articuloEnCarrito.Tipo)) {
      const cantidadActual = articuloEnCarrito.Cantidad ?? 0;
      if (cantidadActual > 1) {
        articuloEnCarrito.Cantidad = cantidadActual - 1;
        this.carritoSubject.next([...this.carrito]);
        if (articuloEnCarrito.Tipo !== 'Servicio') {
           this.solicitarAjusteStockInventarioSubject.next({ codigoArticulo, cantidadDelta: 1, tipoArticulo: articuloEnCarrito.Tipo });
        }
      } else {
        this.eliminarLineaCompletaArticulo(codigoArticulo, articuloEnCarrito.Tipo);
      }
    }
  }

  eliminarLineaCompletaArticulo(codigoArticulo: string, tipoArticulo?: string | null): void {
    const index = this.carrito.findIndex(a => a.Codigo === codigoArticulo && (tipoArticulo ? a.Tipo === tipoArticulo : true) );
    if (index > -1) {
      const articuloEliminado = this.carrito[index];
      this.carrito.splice(index, 1);
      this.carritoSubject.next([...this.carrito]);
      if (articuloEliminado.Tipo !== 'Servicio') {
        this.solicitarAjusteStockInventarioSubject.next({
          codigoArticulo,
          cantidadDelta: articuloEliminado.Cantidad ?? 0,
          tipoArticulo: articuloEliminado.Tipo
        });
      }
    }
  }

  limpiarCarrito(): void {
    const copiaCarrito = [...this.carrito];
    this.carrito = [];
    this.carritoSubject.next(this.carrito);

    copiaCarrito.forEach(art => {
      if (art.Tipo !== 'Servicio' && art.Codigo) {
        this.solicitarAjusteStockInventarioSubject.next({
          codigoArticulo: art.Codigo,
          cantidadDelta: art.Cantidad ?? 0,
          tipoArticulo: art.Tipo
        });
      }
    });
  }

  // Método para actualizar el descuento de un artículo en el carrito
  actualizarDescuentoArticulo(codigoArticulo: string, tipoArticulo: string | null | undefined, nuevoDescuento: number): void {
    const articuloEnCarrito = this.carrito.find(a => a.Codigo === codigoArticulo && a.Tipo === tipoArticulo);
    if (articuloEnCarrito) {
      articuloEnCarrito.DescuentoPorcentaje = Math.max(0, Math.min(100, nuevoDescuento || 0)); // Asegurar que esté entre 0 y 100
      this.carritoSubject.next([...this.carrito]); // Notificar para que se recalculen totales
    }
  }
}