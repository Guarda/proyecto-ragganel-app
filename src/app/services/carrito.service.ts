import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ArticuloVenta } from '../paginas/interfaces/articuloventa';
import { VentasBaseService } from './ventas-base.service';
import { Usuarios } from '../paginas/interfaces/usuarios';
import { Cliente } from '../paginas/interfaces/clientes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class CarritoService {
  // El BehaviorSubject es ahora la única fuente de verdad en el frontend.
  private carritoSubject = new BehaviorSubject<ArticuloVenta[]>([]);
  public carrito$ = this.carritoSubject.asObservable();

  private solicitarAjusteStockInventarioSubject = new Subject<{ codigoArticulo: string, cantidadDelta: number, tipoArticulo: string }>();
  solicitarAjusteStockInventario$ = this.solicitarAjusteStockInventarioSubject.asObservable();

  private solicitarCargaCarritoSubject = new BehaviorSubject<any | null>(null);
  solicitarCargaCarrito$ = this.solicitarCargaCarritoSubject.asObservable();

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

    // Llama al servicio de ventas-base que hace la petición HTTP
    return this.ventasBaseService.listarCarritoVentaUsuarioXClienteEnCurso(usuario, cliente).pipe(
      tap((respuestaApi: any[]) => {
        // La respuesta de la API ya es un array, como confirmaste.
        // Ahora mapeamos cada objeto del array al formato ArticuloVenta.
        const itemsFormateados: ArticuloVenta[] = (respuestaApi || []).map((item: any) => ({
          // La propiedad en la UI se llama 'Tipo', la de la API es 'TipoArticulo'
          Tipo: item.TipoArticulo,
          Codigo: item.CodigoArticulo,
          NombreArticulo: item.NombreArticulo, // Asegúrate que tu SP devuelva este campo
          Cantidad: item.Cantidad,
          PrecioBase: parseFloat(item.PrecioVenta.toString()),
          DescuentoPorcentaje: parseFloat(item.Descuento.toString()),
          SubtotalSinIVA: parseFloat(item.SubtotalSinIVA.toString()),
          LinkImagen: item.LinkImagen || '',
          // Estos campos son opcionales pero buenos para tener
          Estado: item.Estado || '',
          PrecioOriginalSinMargen: parseFloat(item.PrecioOriginalSinMargen?.toString() || item.PrecioVenta.toString()),
          MargenAplicado: item.MargenAplicado ?? 0,
          IdMargenFK: item.IdMargenFK ?? null,
          PrecioVentaDisplay: item.PrecioVentaDisplay !== undefined
            ? item.PrecioVentaDisplay
            : (item.PrecioVenta !== undefined ? parseFloat(item.PrecioVenta.toString()).toFixed(2) : '0.00')
        }));
        
        // Ordenamos para una visualización consistente
        itemsFormateados.sort((a, b) => (a.NombreArticulo || '').localeCompare(b.NombreArticulo || ''));

        // Emitimos la lista de artículos formateada a todos los componentes suscritos
        this.carritoSubject.next(itemsFormateados);
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
          // Refrescar el carrito desde la BD
          this.refrescarCarrito(usuario, cliente).subscribe();

          // LÍNEA AÑADIDA: Notificar a la tabla principal que recargue el inventario.
          this.solicitarRecargaArticulosSubject.next();

          // La lógica para ajustar el stock localmente ya no es necesaria, 
          // ya que la recarga completa desde el servidor es más precisa.
          // Se puede comentar o eliminar la siguiente sección:
          /*
          */

        } else {
          // Si el backend lanzó un error 400 con un mensaje de negocio
          let errorMessage = respuesta.error || 'Error desconocido del servidor.';
          if (respuesta.dbError) { // Si el backend pasa el dbError (Stock insuficiente)
              errorMessage = respuesta.dbError;
          }
          this.snackBar.open(`Error: ${errorMessage}`, 'Cerrar', { duration: 4000 });
          console.error('El backend no pudo procesar la solicitud:', respuesta);
        }
      },
      error: (err) => {
        // Aquí 'err' ya es el string limpio devuelto por errorHandler
        this.snackBar.open(err, 'Cerrar', { duration: 4000 });
        // Ya no necesitas loguear el error aquí porque el errorHandler lo hizo.
      }
    });
  }

  public solicitarRecargaDeArticulos(): void {
    this.solicitarRecargaArticulosSubject.next();
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

    this.ventasBaseService.disminuirArticuloDelCarrito(datosParaBackend).subscribe({
      next: (respuesta) => {
        if (respuesta.success) {
          this.snackBar.open('Cantidad disminuida.', 'Cerrar', { duration: 2000 });

          // Refrescamos el carrito para actualizar la UI del carrito.
          this.refrescarCarrito(usuario, cliente).subscribe();

          // LÍNEA AÑADIDA: Notificar a la tabla principal que recargue el inventario.
          this.solicitarRecargaArticulosSubject.next();

        } else {
          this.snackBar.open(`Error del servidor: ${respuesta.error}`, 'Cerrar', { duration: 4000 });
        }
      },
      error: (err) => {
        // Aquí 'err' ya es el string limpio devuelto por errorHandler
        this.snackBar.open(err, 'Cerrar', { duration: 4000 });
        // Ya no necesitas loguear el error aquí porque el errorHandler lo hizo.
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

    this.ventasBaseService.eliminarArticuloDelCarrito(datosParaBackend).subscribe({
      next: (respuesta) => {
        if (respuesta.success) {
          this.snackBar.open(`${articulo.NombreArticulo} eliminado del carrito.`, 'Cerrar', { duration: 2000 });

          // Refrescamos el carrito desde la BD para actualizar la lista.
          this.refrescarCarrito(usuario, cliente).subscribe();

          // LÍNEA AÑADIDA: Notificar a la tabla principal que recargue el inventario.
          this.solicitarRecargaArticulosSubject.next();

        } else {
          this.snackBar.open(`Error del servidor: ${respuesta.error}`, 'Cerrar', { duration: 4000 });
        }
      },
      error: (err) => {
        // Aquí 'err' ya es el string limpio devuelto por errorHandler
        this.snackBar.open(err, 'Cerrar', { duration: 4000 });
        // Ya no necesitas loguear el error aquí porque el errorHandler lo hizo.
      }
    });
  }

  /**
   * Actualiza el descuento de un artículo.
   */
  public actualizarDescuentoArticulo(articulo: ArticuloVenta, nuevoDescuento: number, usuario: Usuarios, cliente: Cliente): void {
    const sanitizedDescuento = Math.max(0, Math.min(100, nuevoDescuento || 0));

    // Calcula el nuevo subtotal basado en el descuento
    const nuevoSubtotalSinIVA = (articulo.PrecioBase ?? 0) * (1 - sanitizedDescuento / 100);

    // Prepara los datos para el NUEVO endpoint
    const datosParaBackend = {
      IdUsuario: usuario.id,
      IdCliente: cliente.id,
      TipoArticulo: articulo.Tipo!,
      CodigoArticulo: articulo.Codigo!,
      Descuento: sanitizedDescuento,
      SubtotalSinIVA: nuevoSubtotalSinIVA
    };

    // Llama al NUEVO método en ventas-base.service
    this.ventasBaseService.actualizarDetalleCarrito(datosParaBackend).subscribe({
      next: (respuesta) => {
        if (respuesta.success) {
          this.snackBar.open('Descuento actualizado.', 'Cerrar', { duration: 1500 });
          // Refrescamos el carrito para que la UI refleje el cambio confirmado por la BD
          this.refrescarCarrito(usuario, cliente).subscribe();
          // NO es necesario recargar el inventario, ya que el stock no cambió.
        } else {
          this.snackBar.open(`Error al actualizar descuento: ${respuesta.error}`, 'Cerrar', { duration: 4000 });
        }
      },
      error: (err) => {
        // Aquí 'err' ya es el string limpio devuelto por errorHandler
        this.snackBar.open(err, 'Cerrar', { duration: 4000 });
        // Ya no necesitas loguear el error aquí porque el errorHandler lo hizo.
      }
    });
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
        // Aquí 'err' ya es el string limpio devuelto por errorHandler
        this.snackBar.open(err, 'Cerrar', { duration: 4000 });
        // Ya no necesitas loguear el error aquí porque el errorHandler lo hizo.
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

  public listarCarritosActivosPorUsuario(idUsuario: number): Observable<any[]> {
    const url = `http://localhost:3000/carrito/vigentes/${idUsuario}`;
    return this.httpClient.get<any>(url).pipe( // Cambiado a get<any>
      map(respuesta => respuesta.data || respuesta), // Extrae la propiedad 'data' o devuelve la respuesta si no existe
      catchError(this.errorHandler)
    );
  }

  public solicitarCargaDeCarrito(carrito: any): void {
    this.solicitarCargaCarritoSubject.next(carrito);
  }

  // En tu CarritoService (o el servicio correspondiente)

 public liberarCarrito(idCarrito: number, idUsuario: number): Observable<any> {
    const params = {
      idUsuario: idUsuario.toString() 
    };
    // ⭐️ 2. Construir la URL base
    const url = `http://localhost:3000/carrito/${idCarrito}`;
    return this.httpClient.delete(url, { params: params }).pipe(
      catchError(this.errorHandler)
    );
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