import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ArticuloVenta } from '../paginas/interfaces/articuloventa';
import { VentasBaseService } from './ventas-base.service';
import { Usuarios } from '../paginas/interfaces/usuarios';
import { Cliente } from '../paginas/interfaces/clientes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  // El BehaviorSubject es ahora la única fuente de verdad en el frontend.
  private carritoSubject = new BehaviorSubject<ArticuloVenta[]>([]);
  public carrito$ = this.carritoSubject.asObservable();
 
  private solicitarAjusteStockInventarioSubject = new Subject<{ codigoArticulo: string, cantidadDelta: number, tipoArticulo: string }>();
  solicitarAjusteStockInventario$ = this.solicitarAjusteStockInventarioSubject.asObservable();

  // Añade este nuevo Subject para notificar la recarga
  private solicitarRecargaArticulosSubject = new Subject<void>();
  solicitarRecargaArticulos$ = this.solicitarRecargaArticulosSubject.asObservable();


  constructor(
    private ventasBaseService: VentasBaseService,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient
  ) { }

  /**
   * **CAMBIO CLAVE: Método central para refrescar el carrito desde la BD.**
   * Obtiene el estado actual del carrito desde el backend y lo emite a todos los suscriptores.
   * Este método será llamado después de CUALQUIER operación que modifique el carrito.
   * @param usuario El usuario actual.
   * @param cliente El cliente seleccionado.
   * @returns Un Observable que completa cuando el carrito se ha refrescado.
   */
  public refrescarCarrito(usuario: Usuarios, cliente: Cliente): Observable<ArticuloVenta[]> {
    if (!usuario?.id || !cliente?.id) {
      this.carritoSubject.next([]); // Si no hay cliente/usuario, el carrito está vacío.
      return of([]);
    }

    return this.ventasBaseService.listarCarritoVentaUsuarioXClienteEnCurso(usuario, cliente).pipe(
      tap((response: any) => {
        // Permite manejar ambos casos: array directo o objeto con 'items'
        const items = Array.isArray(response) ? response : (response?.items || []);
        const formattedItems: ArticuloVenta[] = (items || []).map((item: any) => ({
          Tipo: item.TipoArticulo,
          Codigo: item.CodigoArticulo,
          NombreArticulo: item.NombreArticulo,
          Cantidad: item.Cantidad,
          PrecioBase: parseFloat(item.PrecioVenta.toString()),
          DescuentoPorcentaje: parseFloat(item.Descuento.toString()),
          SubtotalSinIVA: parseFloat(item.SubtotalSinIVA.toString()),
          LinkImagen: item.LinkImagen || '',
          Estado: item.Estado || '',
          PrecioOriginalSinMargen: parseFloat(item.PrecioOriginalSinMargen?.toString() || item.PrecioVenta.toString()),
        }));
        // Ordenamos para una visualización consistente
        formattedItems.sort((a, b) => {
          if (a.Tipo && b.Tipo && a.Tipo !== b.Tipo) return a.Tipo.localeCompare(b.Tipo);
          if (a.NombreArticulo && b.NombreArticulo) return a.NombreArticulo.localeCompare(b.NombreArticulo);
          return 0;
        });

        this.carritoSubject.next(formattedItems); // Emitir el nuevo estado del carrito.
      }),
      catchError(err => {
        console.error('Error al refrescar el carrito desde la BD:', err);
        this.snackBar.open('No se pudo actualizar el estado del carrito.', 'Cerrar', { duration: 3000 });
        this.carritoSubject.next([]); // En caso de error, emitir un carrito vacío.
        return of([]);
      })
    );
  }

  /**
   * Agrega un artículo o actualiza su cantidad/descuento en el backend.
   * Luego, en lugar de modificar el estado local, refresca todo el carrito.
   * @param datosParaBackend Datos del artículo a agregar/modificar.
   * @param usuario El usuario para poder refrescar el carrito.
   * @param cliente El cliente para poder refrescar el carrito.
   * @param nombreArticulo El nombre del artículo para los mensajes de feedback.
   */
  private modificarArticuloEnCarrito(
    datosParaBackend: any,
    usuario: Usuarios,
    cliente: Cliente,
    nombreArticulo: string,
    mensajeExito: string
  ): void {
    this.ventasBaseService.agregarArticuloAlCarrito(datosParaBackend).subscribe({
      next: (respuesta) => {
        if (respuesta.success) {
          this.snackBar.open(mensajeExito, 'Cerrar', { duration: 2000 });
          // **CAMBIO CLAVE: Refrescar el carrito desde la BD**
          this.refrescarCarrito(usuario, cliente).subscribe();

          // Notificar ajuste de stock si es necesario (cuando se agrega/quita un artículo)
          if (datosParaBackend.Cantidad === 1 || datosParaBackend.Cantidad === -1) {
            if (datosParaBackend.TipoArticulo !== 'Servicio') {
              this.solicitarAjusteStockInventarioSubject.next({
                codigoArticulo: datosParaBackend.CodigoArticulo,
                cantidadDelta: -datosParaBackend.Cantidad, // Invertimos: si agregamos 1 (-1 de stock), si quitamos 1 (+1 de stock)
                tipoArticulo: datosParaBackend.TipoArticulo
              });
            }
          }

        } else {
          this.snackBar.open(`Error del servidor: ${respuesta.error}`, 'Cerrar', { duration: 4000 });
          console.error('El backend no pudo procesar la solicitud:', respuesta.error);
        }
      },
      error: (err) => {
        this.snackBar.open('No se pudo comunicar con el servidor.', 'Cerrar', { duration: 4000 });
        console.error('Error de conexión:', err);
      }
    });
  }


  // --- MÉTODOS PÚBLICOS SIMPLIFICADOS ---

  /**
   * Método llamado desde `TablaArticulosVentasComponent` para agregar un nuevo artículo.
   */
  public notificarAgregadoAlCarrito(articuloMaestro: ArticuloVenta, usuario: Usuarios, cliente: Cliente): void {
    if (!usuario?.id || !cliente?.id) {
      this.snackBar.open('Error: Usuario o Cliente no seleccionado.', 'Cerrar', { duration: 4000 });
      return;
    }

    const datosParaBackend = {
      IdUsuario: usuario.id,
      IdCliente: cliente.id,
      TipoArticulo: articuloMaestro.Tipo!,
      CodigoArticulo: articuloMaestro.Codigo!,
      PrecioVenta: Number(articuloMaestro.PrecioBase),
      Descuento: 0,
      SubtotalSinIVA: Number(articuloMaestro.PrecioBase),
      Cantidad: 1 // Siempre se agrega de a uno
    };

    this.modificarArticuloEnCarrito(datosParaBackend, usuario, cliente, articuloMaestro.NombreArticulo!, `${articuloMaestro.NombreArticulo} agregado al carrito.`);
  }

  /**
   * Incrementa la cantidad de un artículo existente en el carrito.
   */
  public solicitarIncrementoCantidad(articulo: ArticuloVenta, usuario: Usuarios, cliente: Cliente): void {
    const datosParaBackend = {
      IdUsuario: usuario.id,
      IdCliente: cliente.id,
      TipoArticulo: articulo.Tipo!,
      CodigoArticulo: articulo.Codigo!,
      PrecioVenta: Number(articulo.PrecioBase),
      Descuento: Number(articulo.DescuentoPorcentaje),
      SubtotalSinIVA: Number(articulo.PrecioBase) * (1 - (articulo.DescuentoPorcentaje ?? 0) / 100),
      Cantidad: 1 // Delta de +1
    };
    this.modificarArticuloEnCarrito(datosParaBackend, usuario, cliente, articulo.NombreArticulo!, 'Cantidad incrementada.');
  }

  /**
   * Decrementa la cantidad. El backend manejará la eliminación si la cantidad llega a 0.
   */
  public decrementarCantidadEnCarrito(articulo: ArticuloVenta, usuario: Usuarios, cliente: Cliente): void {
    const datosParaBackend = {
      IdUsuario: usuario.id,
      IdCliente: cliente.id,
      TipoArticulo: articulo.Tipo!,
      CodigoArticulo: articulo.Codigo!
    };

    // ANTES: Llamaba a modificarArticuloEnCarrito, que llamaba a AGREGAR.
    // AHORA: Llama al nuevo método para DISMINUIR.
    this.ventasBaseService.disminuirArticuloDelCarrito(datosParaBackend).subscribe({
      next: (respuesta) => {
        if (respuesta.success) {
          this.snackBar.open('Cantidad disminuida.', 'Cerrar', { duration: 2000 });
          
          // Después de una disminución exitosa, refrescamos todo el carrito
          // para asegurarnos de que la UI muestra la cantidad correcta o si el ítem se eliminó.
          this.refrescarCarrito(usuario, cliente).subscribe();
          
          // También notificamos a la tabla de artículos que devuelva 1 unidad al stock.
          if (articulo.Tipo !== 'Servicio') {
            this.solicitarAjusteStockInventarioSubject.next({
              codigoArticulo: articulo.Codigo!,
              cantidadDelta: 1, // Se devuelve 1 al stock
              tipoArticulo: articulo.Tipo!
            });
          }

        } else {
          this.snackBar.open(`Error del servidor: ${respuesta.error}`, 'Cerrar', { duration: 4000 });
        }
      },
      error: (err) => {
        this.snackBar.open('Error de conexión al disminuir la cantidad.', 'Cerrar', { duration: 4000 });
        console.error('Error de conexión:', err);
      }
    });
  }

  /**
   * Elimina una línea completa de artículo del carrito.
   */
  public eliminarLineaCompletaArticulo(articulo: ArticuloVenta, usuario: Usuarios, cliente: Cliente): void {
  const cantidadActual = articulo.Cantidad ?? 0;
  
  const datosParaBackend = {
    IdUsuario: usuario.id,
    IdCliente: cliente.id,
    TipoArticulo: articulo.Tipo!,
    CodigoArticulo: articulo.Codigo!
  };

  // LLAMAMOS AL NUEVO MÉTODO EN EL SERVICIO BASE
  this.ventasBaseService.eliminarArticuloDelCarrito(datosParaBackend).subscribe({
    next: (respuesta) => {
      if (respuesta.success) {
        this.snackBar.open(`${articulo.NombreArticulo} eliminado del carrito.`, 'Cerrar', { duration: 2000 });
        
        // 1. Refrescamos el carrito desde la BD para actualizar la lista.
        this.refrescarCarrito(usuario, cliente).subscribe();
        
        // 2. Notificamos a la tabla de artículos que devuelva el stock.
        if (articulo.Tipo !== 'Servicio') {
          this.solicitarAjusteStockInventarioSubject.next({
            codigoArticulo: articulo.Codigo!,
            cantidadDelta: cantidadActual, // Devolvemos la cantidad completa al stock
            tipoArticulo: articulo.Tipo!
          });
        }
      } else {
        this.snackBar.open(`Error del servidor: ${respuesta.error}`, 'Cerrar', { duration: 4000 });
      }
    },
    error: (err) => {
      this.snackBar.open('Error de conexión al eliminar la línea.', 'Cerrar', { duration: 4000 });
      console.error('Error de conexión:', err);
    }
  });
}

  /**
   * Actualiza el descuento de un artículo.
   */
  public actualizarDescuentoArticulo(articulo: ArticuloVenta, nuevoDescuento: number, usuario: Usuarios, cliente: Cliente): void {
    const sanitizedDescuento = Math.max(0, Math.min(100, nuevoDescuento || 0));
    const datosParaBackend = {
      IdUsuario: usuario.id,
      IdCliente: cliente.id,
      TipoArticulo: articulo.Tipo!,
      CodigoArticulo: articulo.Codigo!,
      PrecioVenta: Number(articulo.PrecioBase),
      Descuento: sanitizedDescuento,
      SubtotalSinIVA: Number(articulo.PrecioBase) * (1 - sanitizedDescuento / 100),
      Cantidad: articulo.Cantidad ?? 0 // Se envía la cantidad actual para recalcular totales en el backend
    };

    this.modificarArticuloEnCarrito(datosParaBackend, usuario, cliente, articulo.NombreArticulo!, 'Descuento actualizado.');
  }

  

public limpiarCarrito(usuario: Usuarios, cliente: Cliente): void {
    if (!usuario?.id || !cliente?.id) return;

    this.ventasBaseService.limpiarCarritoDeVentas(usuario.id, cliente.id).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.snackBar.open('Carrito limpiado.', 'Cerrar', { duration: 2000 });

          // 1. Refresca el carrito (esto hará que la UI del carrito desaparezca)
          this.refrescarCarrito(usuario, cliente).subscribe();
          
          // 2. AHORA, NOTIFICAMOS A LA TABLA DE ARTÍCULOS QUE DEBE RECARGARSE
          this.solicitarRecargaArticulosSubject.next();

        } else {
          this.snackBar.open('Error del servidor al limpiar el carrito.', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        this.snackBar.open('Error de conexión al limpiar el carrito.', 'Cerrar', { duration: 3000 });
      }
    });
  }
  /**
   * Esta función es ahora solo para la UI, ya que el precio real se define al agregar el artículo.
   * No necesita persistencia, solo actualiza la visualización del carrito actual.
   */
  actualizarPreciosDelCarritoConNuevoMargen(nuevoMargenPorcentaje: number): void {
    if (nuevoMargenPorcentaje === undefined || nuevoMargenPorcentaje === null) return;

    const carritoActual = this.carritoSubject.getValue();
    const carritoActualizado = carritoActual.map(articulo => {
      const precioConNuevoMargen = (articulo.PrecioOriginalSinMargen ?? 0) * (1 + (nuevoMargenPorcentaje / 100));
      const precioBaseActualizado = parseFloat(precioConNuevoMargen.toFixed(4));
      const subtotalActualizado = parseFloat((precioBaseActualizado * (1 - (articulo.DescuentoPorcentaje ?? 0) / 100) * (articulo.Cantidad ?? 1)).toFixed(4));

      return {
        ...articulo,
        PrecioBase: precioBaseActualizado,
        SubtotalSinIVA: subtotalActualizado
      };
    });

    this.carritoSubject.next(carritoActualizado);
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}