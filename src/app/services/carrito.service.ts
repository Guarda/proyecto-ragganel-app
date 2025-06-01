import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ArticuloVenta } from '../paginas/interfaces/articuloventa'; // Ajusta ruta

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carrito: ArticuloVenta[] = [];
  private carritoSubject = new BehaviorSubject<ArticuloVenta[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  // Necesitarás una forma de obtener el precio base *original* (sin margen) de los artículos
  // si quieres recalcular el carrito cuando el margen global cambia.
  // Esto podría ser obteniéndolos de nuevo de un servicio de artículos con su precio costo/base.
  // O almacenando el PrecioOriginalSinMargen en ArticuloVenta.

  // Asumiremos para esta versión que `notificarAgregadoAlCarrito` recibe el artículo
  // con `PrecioBase` YA INCLUYENDO EL MARGEN.
  // El `articuloDelInventario` que viene de `TablaArticulosVentasComponent` ya debe tener esto.
  notificarAgregadoAlCarrito(articuloConMargenAplicado: ArticuloVenta, esServicio: boolean): void {
    const articuloCodigo = articuloConMargenAplicado.Codigo!;

    // El PrecioBase de articuloConMargenAplicado ya debe tener el margen.
    // Y también necesitamos guardar el precio original sin margen por si el margen global cambia.
    const articuloParaCarrito: ArticuloVenta = {
      ...articuloConMargenAplicado,
      // PrecioOriginalSinMargen: articuloConMargenAplicado.PrecioOriginalSinMargen, // Necesitarías este campo desde el origen
      Cantidad: 1,
      DescuentoPorcentaje: 0
    };

    if (this.esAgrupableEnCarrito(articuloConMargenAplicado.Tipo)) {
      const existenteEnCarrito = this.carrito.find(a => a.Codigo === articuloCodigo);
      if (existenteEnCarrito) {
        existenteEnCarrito.Cantidad = (existenteEnCarrito.Cantidad ?? 0) + 1;
        // No se toca el PrecioBase aquí, ya que el margen se aplica al agregar o al cambiar margen global.
      } else {
        this.carrito.push(articuloParaCarrito);
      }
    } else {
      this.carrito.push(articuloParaCarrito);
    }
    this.carritoSubject.next([...this.carrito]);
  }

  // NUEVO: Método para actualizar precios en el carrito si el margen global cambia.
  // Esto requiere que cada ArticuloVenta en el carrito tenga una referencia a su precio antes de margen.
  // Asumiremos que tienes un campo `PrecioOriginalSinMargen` en tu interfaz `ArticuloVenta`.
  // Si no lo tienes, DEBES añadirlo y asegurarte que se popule cuando el artículo se obtiene originalmente.
  actualizarPreciosDelCarritoConNuevoMargen(nuevoMargenPorcentaje: number): void {
    if (nuevoMargenPorcentaje === undefined) return;

    this.carrito.forEach(articulo => {
      // Comprobar si el artículo tiene el precio original guardado
      if (articulo.PrecioOriginalSinMargen !== undefined && articulo.PrecioOriginalSinMargen !== null) {
        const precioConNuevoMargen = articulo.PrecioOriginalSinMargen * (1 + (nuevoMargenPorcentaje / 100));
        articulo.PrecioBase = parseFloat(precioConNuevoMargen.toFixed(4)); // Actualiza el PrecioBase que incluye el margen
      } else {
        // Opcional: Log o manejo si falta el precio original. Podría significar que este artículo
        // no debería verse afectado o hay un error en cómo se agregó.
        console.warn(`Artículo ${articulo.Codigo} no tiene PrecioOriginalSinMargen. No se actualizó el margen.`);
      }
    });
    this.carritoSubject.next([...this.carrito]); // Notificar para que la UI y los cálculos se actualicen
  }


  // Los métodos existentes (incrementar, decrementar, eliminar, actualizarDescuento, limpiar)
  // deberían funcionar bien, ya que operan sobre los artículos en el carrito,
  // cuyo PrecioBase ya reflejará el margen correcto.
  private esAgrupableEnCarrito(tipo?: string | null): boolean {
    return tipo === 'Insumo';
  }

  solicitarAjusteStockInventarioSubject = new Subject<{ codigoArticulo: string, cantidadDelta: number, tipoArticulo?: string | null }>();
  solicitarAjusteStockInventario$ = this.solicitarAjusteStockInventarioSubject.asObservable();

  stockTomadoConExitoSubject = new Subject<string>();
  stockTomadoConExito$ = this.stockTomadoConExitoSubject.asObservable();


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
        if (articuloEnCarrito.Tipo !== 'Servicio') { // Solo ajustar stock si no es servicio
          this.solicitarAjusteStockInventarioSubject.next({ codigoArticulo, cantidadDelta: 1, tipoArticulo: articuloEnCarrito.Tipo });
        }
      } else { // Si la cantidad es 1, eliminar la línea completa
        this.eliminarLineaCompletaArticulo(codigoArticulo, articuloEnCarrito.Tipo);
      }
    }
  }

  eliminarLineaCompletaArticulo(codigoArticulo: string, tipoArticulo?: string | null): void {
    // Encuentra el índice del artículo a eliminar. Considera el tipo para evitar eliminar
    // un producto y un servicio si comparten código (aunque no debería ser común).
    const index = this.carrito.findIndex(a => a.Codigo === codigoArticulo && (tipoArticulo ? a.Tipo === tipoArticulo : true));

    if (index > -1) {
      const articuloEliminado = this.carrito[index];
      this.carrito.splice(index, 1);
      this.carritoSubject.next([...this.carrito]);

      // Devolver stock solo si no es un servicio
      if (articuloEliminado.Tipo !== 'Servicio' && articuloEliminado.Codigo) {
        this.solicitarAjusteStockInventarioSubject.next({
          codigoArticulo: articuloEliminado.Codigo,
          cantidadDelta: articuloEliminado.Cantidad ?? 0, // Devuelve la cantidad que había
          tipoArticulo: articuloEliminado.Tipo
        });
      }
    }
  }

  limpiarCarrito(): void {
    const copiaCarrito = [...this.carrito]; // Copia para iterar y devolver stock
    this.carrito = [];
    this.carritoSubject.next(this.carrito);

    // Devolver el stock de todos los artículos que no sean servicios
    copiaCarrito.forEach(art => {
      if (art.Tipo !== 'Servicio' && art.Codigo) {
        this.solicitarAjusteStockInventarioSubject.next({
          codigoArticulo: art.Codigo,
          cantidadDelta: art.Cantidad ?? 0, // Devuelve la cantidad que había
          tipoArticulo: art.Tipo
        });
      }
    });
  }

  actualizarDescuentoArticulo(codigoArticulo: string, tipoArticulo: string | null | undefined, nuevoDescuento: number): void {
    const articuloEnCarrito = this.carrito.find(a => a.Codigo === codigoArticulo && a.Tipo === tipoArticulo);
    if (articuloEnCarrito) {
      articuloEnCarrito.DescuentoPorcentaje = Math.max(0, Math.min(100, nuevoDescuento || 0));
      this.carritoSubject.next([...this.carrito]);
    }
  }
}