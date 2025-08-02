// Imports necesarios: Añadimos MatDialog y el nuevo componente de diálogo
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionarPrecioDialogComponent } from '../seleccionar-precio-dialog/seleccionar-precio-dialog.component'; // Asegúrate de que la ruta sea correcta
import { PrecioOpcion } from '../../interfaces/precioopcion';
// Interfaces
import { ArticuloVenta } from '../../interfaces/articuloventa';
import { GrupoArticulos } from '../../interfaces/grupoarticuloventa';
import { Cliente } from '../../interfaces/clientes';
import { Usuarios } from '../../interfaces/usuarios';
import { MargenesVentas } from '../../interfaces/margenes-ventas'; // Interfaz para los márgenes

// Componentes
import { TarjetaDeArticulosComponent } from '../tarjeta-de-articulos/tarjeta-de-articulos.component';

// Servicios
import { ListadoArticulosVentaService } from '../../../services/listado-articulos-venta.service';
import { CarritoService } from '../../../services/carrito.service';
import { VentasBaseService } from '../../../services/ventas-base.service';

import { DialogIngresarPrecioArticuloComponent } from '../dialog-ingresar-precio-articulo/dialog-ingresar-precio-articulo.component';

@Component({
  selector: 'app-tabla-articulos-ventas',
  standalone: true,
  imports: [TarjetaDeArticulosComponent, CommonModule, FormsModule, DialogIngresarPrecioArticuloComponent],
  templateUrl: './tabla-articulos-ventas.component.html',
  styleUrls: ['./tabla-articulos-ventas.component.css']
})
export class TablaArticulosVentasComponent implements OnInit, OnDestroy, OnChanges {

  // --- INPUTS DESDE EL COMPONENTE PADRE ---
  // Inputs eliminados: margenActual y idMargenActual ya no son necesarios.
  // @Input() margenActual: number | null = 0; (ELIMINADO)
  // @Input() idMargenActual: number | null = null; (ELIMINADO)

  // Input nuevo: Recibimos la lista completa de márgenes para usarla en el diálogo.
  @Input() listaDeMargenes: MargenesVentas[] = [];

  // Inputs que se mantienen
  @Input() clienteSeleccionado: Cliente | null = null;
  @Input() usuario: Usuarios | null = null;
  @Input() articulosEnCarrito: ArticuloVenta[] = [];

  // --- PROPIEDADES DEL COMPONENTE ---
  gruposDeArticulos: GrupoArticulos[] = [];
  gruposDeArticulosFiltrados: GrupoArticulos[] = [];
  todosLosArticulosOriginales: ArticuloVenta[] = [];
  private subs = new Subscription();

  // --- PROPIEDADES PARA LOS FILTROS ---
  tipos: string[] = ['Producto', 'Accesorio', 'Insumo', 'Servicio'];
  tipoSeleccionado: string | null = null;
  precioMin: number = 0;
  precioMax: number = 99999;
  searchTerm: string = '';

  constructor(
    private listadoArticulosVentaService: ListadoArticulosVentaService,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar,
    private ventasBaseService: VentasBaseService,
    private dialog: MatDialog // Inyectamos el servicio de diálogos de Angular Material
  ) { }

  ngOnInit(): void {
    // Carga inicial de todos los artículos disponibles para la venta.
    this.subs.add(this.listadoArticulosVentaService.getAll().subscribe({
      next: (data: ArticuloVenta[]) => {
        // Guardamos la lista original. PrecioBase aquí es el costo.
        this.todosLosArticulosOriginales = data;
        this.actualizarGruposDeArticulos(); // Primera actualización de la UI
      },
      error: (err) => console.error('Error al cargar artículos:', err)
    }));

    // Suscripción para ajustar el stock en la UI cuando se modifica en el carrito
    this.subs.add(this.carritoService.solicitarAjusteStockInventario$.subscribe(
      ({ codigoArticulo, cantidadDelta, tipoArticulo }) => {
        if (tipoArticulo === 'Servicio') return;
        const articuloEnInventario = this.todosLosArticulosOriginales.find(a => a.Codigo === codigoArticulo && a.Tipo === tipoArticulo);
        if (articuloEnInventario) {
          articuloEnInventario.Cantidad = (articuloEnInventario.Cantidad ?? 0) + cantidadDelta;
          this.actualizarGruposDeArticulos();
        }
      }
    ));

    // Suscripción para recargar la lista de artículos
    this.subs.add(this.carritoService.solicitarRecargaArticulos$.subscribe(() => {
      this.recargarArticulos();
    }));
  }

  // Se activa cuando cambia un @Input, como la lista de artículos en el carrito.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articulosEnCarrito'] && this.todosLosArticulosOriginales.length > 0) {
      this.actualizarGruposDeArticulos();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * MÉTODO MODIFICADO:
   * Procesa la lista de artículos maestros, filtra los que ya están en el carrito
   * y los agrupa para mostrarlos en la UI. Ya no aplica un margen global.
   */
  private actualizarGruposDeArticulos(): void {
    const codigosEnCarrito = new Set(this.articulosEnCarrito.map(item => item.Codigo));
    const articulosDisponibles = this.todosLosArticulosOriginales.filter(
      articulo => !codigosEnCarrito.has(articulo.Codigo)
    );

    const grupos: { [nombre: string]: ArticuloVenta[] } = {};
    for (const art of articulosDisponibles) {
      // Mostrar solo si es un Servicio o si tiene stock > 0
      if (art.Tipo === 'Servicio' || (art.Cantidad ?? 0) > 0) {
        if (!grupos[art.NombreArticulo!]) {
          grupos[art.NombreArticulo!] = [];
        }
        grupos[art.NombreArticulo!].push(art);
      }
    }
    this.gruposDeArticulos = Object.keys(grupos).map(nombre => {
      const articulosDelGrupo = grupos[nombre];
      const primerArticulo = articulosDelGrupo[0];
      return {
        nombre,
        articulos: articulosDelGrupo,
        imagenUrl: this.getImagePath(primerArticulo.LinkImagen, primerArticulo.Tipo)
      };
    });

    this.aplicarFiltros();
  }

  public iniciarProcesoDeAgregarArticulo(articulo: ArticuloVenta): void {
    // ... (validación de cliente y usuario sin cambios)

    if (!this.clienteSeleccionado || !this.usuario) {
      this.snackBar.open('Por favor, seleccione un cliente primero.', 'Cerrar', { duration: 3000 });
      return;
    }
    // Los servicios se siguen agregando directamente.
    if (articulo.Tipo === 'Servicio') {
    const precioServicio = articulo.PrecioBase ?? 0;
    
    // Se construye el payload con margen 0, como lo necesitas.
    const datosServicio = {
      IdUsuario: this.usuario!.id,
      IdCliente: this.clienteSeleccionado!.id,
      TipoArticulo: articulo.Tipo!,
      CodigoArticulo: articulo.Codigo!,
      PrecioVenta: precioServicio, // El precio base es el precio final de venta.
      Descuento: 0, // El descuento se aplica en el carrito si es necesario.
      Cantidad: 1,
      PrecioBaseOriginal: precioServicio, // El costo y la venta son lo mismo.
      MargenAplicado: 0, // Margen del 0%.
      IdMargenFK: 5 // Se asocia al margen "Precio de Costo" (ID 5).
    };
    
    // Se envía directamente al backend.
    this.enviarArticuloAlBackend(datosServicio, articulo.NombreArticulo!);
    return; // Importante para detener la ejecución aquí.
  }

    const dialogRef = this.dialog.open(SeleccionarPrecioDialogComponent, {
      width: '450px',
      data: { articulo: articulo, margenes: this.listaDeMargenes }
    });

    dialogRef.afterClosed().subscribe((opcionSeleccionada: PrecioOpcion | undefined) => {
      if (!opcionSeleccionada) return;

      // --- INICIO DE LA LÓGICA MODIFICADA ---
      const precioCosto = articulo.PrecioBase ?? 0;

      // CASO 1: El vendedor eligió "Precio Personalizado"
      if (opcionSeleccionada.idMargen === 6) {

        // 2. ABRIMOS EL NUEVO DIÁLOGO PERSONALIZADO
        const precioDialogRef = this.dialog.open(DialogIngresarPrecioArticuloComponent, {
          width: '400px',
          disableClose: true, // Evita que se cierre al hacer clic fuera
          data: { costo: precioCosto, nombre: articulo.NombreArticulo }
        });

        precioDialogRef.afterClosed().subscribe((precioIngresado: number | undefined) => {
          // Si el usuario confirmó y devolvió un precio...
          if (precioIngresado) {
            const datosArticulo = {
              IdUsuario: this.usuario!.id,
              IdCliente: this.clienteSeleccionado!.id,
              TipoArticulo: articulo.Tipo!,
              CodigoArticulo: articulo.Codigo!,
              PrecioVenta: precioIngresado, // Usamos el precio del diálogo
              Descuento: 0,
              Cantidad: 1,
              PrecioBaseOriginal: precioCosto,
              MargenAplicado: opcionSeleccionada.porcentaje,
              IdMargenFK: opcionSeleccionada.idMargen
            };
            this.enviarArticuloAlBackend(datosArticulo, articulo.NombreArticulo!);
          }
          // Si el usuario canceló (precioIngresado es undefined), no hacemos nada.
        });

      } else {
        // CASO 2: El vendedor eligió un margen normal (sin cambios)
        const datosArticulo = {
          IdUsuario: this.usuario!.id,
          IdCliente: this.clienteSeleccionado!.id,
          TipoArticulo: articulo.Tipo!,
          CodigoArticulo: articulo.Codigo!,
          PrecioVenta: opcionSeleccionada.precioFinal,
          Descuento: 0,
          Cantidad: 1,
          PrecioBaseOriginal: articulo.PrecioBase!,
          MargenAplicado: opcionSeleccionada.porcentaje,
          IdMargenFK: opcionSeleccionada.idMargen
        };
        this.enviarArticuloAlBackend(datosArticulo, articulo.NombreArticulo!);
      }
    });
  }

  /**
   * MÉTODO NUEVO:
   * Envía los datos del artículo procesado al backend para ser agregado al carrito.
   * @param datosParaBackend El payload final del artículo.
   * @param nombreArticulo El nombre para mostrar en las notificaciones.
   */
  private enviarArticuloAlBackend(datosParaBackend: any, nombreArticulo: string): void {
    this.subs.add(
      this.ventasBaseService.agregarArticuloAlCarrito(datosParaBackend).subscribe({
        next: (respuesta) => {
          if (respuesta.success) {
            this.snackBar.open(`'${nombreArticulo}' agregado al carrito.`, 'OK', { duration: 2500 });
            // Refrescamos el carrito en la UI principal
            this.carritoService.refrescarCarrito(this.usuario!, this.clienteSeleccionado!).subscribe();
          } else {
            this.snackBar.open(`Error: ${respuesta.dbError || 'No se pudo agregar el artículo.'}`, 'Cerrar', { duration: 5000 });
          }
        },
        error: (err) => {
          console.error("Error al agregar artículo:", err);
          this.snackBar.open('Error de comunicación al agregar el artículo.', 'Cerrar', { duration: 4000 });
        }
      })
    );
  }

  // --- MÉTODOS DE FILTRADO (MODIFICADOS LIGERAMENTE) ---
  aplicarFiltros(): void {
    const lowerCaseSearch = this.searchTerm.toLowerCase();
    this.gruposDeArticulosFiltrados = this.gruposDeArticulos.filter(grupo => {
      const tipoMatch = !this.tipoSeleccionado || grupo.articulos[0].Tipo === this.tipoSeleccionado;
      // El filtro de precio ahora usa el costo base (PrecioBase)
      const precioMatch = grupo.articulos.some(a => (a.PrecioBase ?? 0) >= this.precioMin && (a.PrecioBase ?? 0) <= this.precioMax);
      const searchMatch = !this.searchTerm || grupo.nombre.toLowerCase().includes(lowerCaseSearch) || grupo.articulos.some(a => a.Codigo?.toLowerCase().includes(lowerCaseSearch));
      return tipoMatch && precioMatch && searchMatch;
    });
  }

  // El resto de los métodos (filtrarPorTipo, limpiarFiltros, recargarArticulos, getImagePath) se mantienen igual.
  // ... (pega aquí el resto de tus métodos sin cambios)
  // ... (asegúrate de incluir getImagePath, recargarArticulos, limpiarFiltros y filtrarPorTipo)
  public agregarArticuloPorCodigo(codigo: string): void {
    const articuloMaestro = this.todosLosArticulosOriginales.find(art => art.Codigo === codigo);
    if (!articuloMaestro) {
      this.snackBar.open(`Artículo con código "${codigo}" no encontrado.`, 'Cerrar', { duration: 3000 });
      return;
    }
    // Reutilizamos la lógica principal
    this.iniciarProcesoDeAgregarArticulo(articuloMaestro);
  }

  filtrarPorTipo(tipo: string): void {
    this.tipoSeleccionado = this.tipoSeleccionado === tipo ? null : tipo;
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.tipoSeleccionado = null;
    this.precioMin = 0;
    this.precioMax = 99999;
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  public recargarArticulos(): void {
    this.subs.add(this.listadoArticulosVentaService.getAll().subscribe({
      next: (data: ArticuloVenta[]) => {
        this.todosLosArticulosOriginales = data;
        this.actualizarGruposDeArticulos();
        this.snackBar.open('Lista de artículos actualizada.', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error al recargar la lista de artículos:', err);
        this.snackBar.open('No se pudo refrescar la lista de artículos.', 'Cerrar', { duration: 3000 });
      }
    }));
  }

  // En tabla-articulos-ventas.component.ts

getImagePath(link: string | null, tipo: string | null): string {
  const baseUrl = 'http://localhost:3000';
  let folder = 'img-genericas';
  switch (tipo) {
    case 'Producto': folder = 'img-consolas'; break;
    case 'Accesorio': folder = 'img-accesorios'; break;
    case 'Insumo': folder = 'img-insumos'; break;
    case 'Servicio': folder = 'assets'; break;
  }
  
  if (link) {
    return `${baseUrl}/${folder}/${encodeURIComponent(link)}`;
  }
  
  return `${baseUrl}/assets/placeholder.png`;
}
}