import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ArticuloVenta } from '../../interfaces/articuloventa'; // Asegúrate que esta interfaz tenga PrecioOriginalSinMargen?
import { GrupoArticulos } from '../../interfaces/grupoarticuloventa';
import { TarjetaDeArticulosComponent } from '../tarjeta-de-articulos/tarjeta-de-articulos.component';
import { CommonModule } from '@angular/common';
import { ListadoArticulosVentaService } from '../../../services/listado-articulos-venta.service';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../services/carrito.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tabla-articulos-ventas',
  standalone: true,
  imports: [TarjetaDeArticulosComponent, CommonModule, FormsModule],
  templateUrl: './tabla-articulos-ventas.component.html',
  styleUrls: ['./tabla-articulos-ventas.component.css'] // Corregido styleUrl a styleUrls
})
export class TablaArticulosVentasComponent implements OnInit, OnDestroy {

  constructor(
    private listadoArticulosVentaService: ListadoArticulosVentaService,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar
  ) { }

  @Input() margenActual!: number;

  gruposDeArticulos: GrupoArticulos[] = [];
  gruposDeArticulosFiltrados: GrupoArticulos[] = [];
  todosLosArticulosOriginales: ArticuloVenta[] = []; // Esta lista contiene los artículos tal como vienen del servicio, con su precio base original.
  private subs = new Subscription();
  tipos: string[] = ['Producto', 'Accesorio', 'Insumo', 'Servicio'];
  tipoSeleccionado: string | null = null;
  precioMin: number = 0;
  precioMax: number = 99999; // Considera un valor máximo más realista o dinámico si es necesario

  ngOnInit(): void {
    this.subs.add(this.listadoArticulosVentaService.getAll().subscribe((data: ArticuloVenta[]) => {
      // Almacenamos los artículos originales. Asumimos que 'PrecioBase' aquí es el precio ANTES de cualquier margen de venta dinámico.
      this.todosLosArticulosOriginales = data.map(articulo => ({
        ...articulo,
        // Aseguramos que PrecioOriginalSinMargen se inicialice con el PrecioBase que viene del servicio
        PrecioOriginalSinMargen: articulo.PrecioBase
      }));
      this.actualizarGrupos();
    }));

    this.subs.add(this.carritoService.solicitarAjusteStockInventario$.subscribe(
      ({ codigoArticulo, cantidadDelta, tipoArticulo }) => {
        if (tipoArticulo === 'Servicio') return;

        const articuloEnInventario = this.todosLosArticulosOriginales.find(a => a.Codigo === codigoArticulo);
        if (articuloEnInventario) {
          // 'Cantidad' en todosLosArticulosOriginales representa el stock disponible en la tienda/inventario
          const stockActual = articuloEnInventario.Cantidad ?? 0;

          if (cantidadDelta < 0) { // Se intenta TOMAR stock (ej. botón + en carrito)
            if (stockActual >= Math.abs(cantidadDelta)) { // Verificar si hay suficiente stock
              articuloEnInventario.Cantidad = stockActual + cantidadDelta; // cantidadDelta es negativo
              this.actualizarGrupos();
              this.carritoService.confirmarIncrementoEnCarrito(codigoArticulo);
            } else {
              this.snackBar.open(`Stock insuficiente para ${articuloEnInventario.NombreArticulo}`, 'Cerrar', { duration: 3000 });
            }
          } else { // Se DEVUELVE stock (cantidadDelta > 0)
            articuloEnInventario.Cantidad = stockActual + cantidadDelta;
            this.actualizarGrupos();
          }
        }
      }
    ));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  actualizarGrupos(): void {
    const grupos: { [nombre: string]: ArticuloVenta[] } = {};
    for (const art of this.todosLosArticulosOriginales) {
      // Mostrar en la lista si es servicio o si tiene stock (Cantidad > 0)
      if (art.Tipo === 'Servicio' || (art.Cantidad !== undefined && art.Cantidad !== null && art.Cantidad > 0)) {
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
        articulos: articulosDelGrupo, // Estos artículos mantienen su PrecioBase original (sin margen de venta dinámico)
        imagenUrl: this.getImagePath(primerArticulo.LinkImagen, primerArticulo.Tipo)
      };
    });
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.gruposDeArticulosFiltrados = this.gruposDeArticulos.filter(grupo => {
      const cumpleTipo = this.tipoSeleccionado
        ? grupo.articulos.some(a => a.Tipo === this.tipoSeleccionado)
        : true;

      // El filtro de precio debe operar sobre el PrecioBase original (antes de margen)
      const cumplePrecio = grupo.articulos.some(a => {
        const precioOriginal = a.PrecioOriginalSinMargen ?? a.PrecioBase; // Usar PrecioOriginalSinMargen si existe, sino el PrecioBase original
        return precioOriginal != null && precioOriginal >= this.precioMin && precioOriginal <= this.precioMax;
      });
      return cumpleTipo && cumplePrecio;
    });
  }

  filtrarPorTipo(tipo: string): void {
    this.tipoSeleccionado = this.tipoSeleccionado === tipo ? null : tipo;
    this.aplicarFiltros();
  }

  getImagePath(link: string | null, tipoArticulo: string | null): string {
    const baseUrl = 'http://localhost:3000'; // Considera hacerlo configurable
    let folder = 'assets'; // Carpeta por defecto para imágenes no encontradas o tipos no especificados

    switch (tipoArticulo) {
      case 'Producto': folder = 'img-consolas'; break;
      case 'Accesorio': folder = 'img-accesorios'; break;
      case 'Insumo': folder = 'img-insumos'; break;
      case 'Servicio': folder = 'assets'; break; // O una carpeta específica para servicios
      default: folder = 'img-genericas'; // Una carpeta para imágenes genéricas o placeholders
    }
    const defaultImage = `${baseUrl}/assets/placeholder.png`; // Imagen placeholder general
    return link ? `${baseUrl}/${folder}/${link}` : defaultImage;
  }

  /**
   * Agrega un artículo al carrito desde la tarjeta de artículo (cuando el usuario hace clic).
   * @param articuloQueLlega El artículo seleccionado desde la UI. Su PrecioBase es el original.
   * @param margenPorcentajeActual El margen de venta actual seleccionado en el Punto de Venta.
   */
  public agregarAlCarrito(articuloOriginalDesdeUI: ArticuloVenta, margenPorcentajeActual: number): void {
    // articuloOriginalDesdeUI es una instancia de los artículos mostrados en la UI (gruposDeArticulosFiltrados),
    // por lo tanto, su PrecioBase es el original (sin margen de venta).
    // Buscamos el artículo maestro en `todosLosArticulosOriginales` para asegurar la integridad del stock.
    const articuloEnInventarioMaestro = this.todosLosArticulosOriginales.find(a => a.Codigo === articuloOriginalDesdeUI.Codigo && a.Tipo === articuloOriginalDesdeUI.Tipo);

    if (!articuloEnInventarioMaestro) {
      this.snackBar.open("Error crítico: Artículo no encontrado en el inventario maestro.", 'Cerrar', { duration: 3000 });
      return;
    }

    const esServicio = articuloEnInventarioMaestro.Tipo === 'Servicio';
    const stockDisponibleInventario = articuloEnInventarioMaestro.Cantidad ?? 0;

    if (esServicio || stockDisponibleInventario > 0) {
      // 1. Guardar el precio original ANTES de aplicar el margen.
      // `articuloEnInventarioMaestro.PrecioBase` es el precio original sin margen.
      const precioOriginalSinMargen = articuloEnInventarioMaestro.PrecioBase;

      if (precioOriginalSinMargen === undefined || precioOriginalSinMargen === null) {
        this.snackBar.open(`Error: El artículo ${articuloEnInventarioMaestro.NombreArticulo} no tiene un precio base definido.`, 'Cerrar', { duration: 4000 });
        return;
      }

      // 2. Calcular el nuevo PrecioBase CON el margen aplicado.
      const precioConMargen = precioOriginalSinMargen * (1 + (margenPorcentajeActual / 100));

      // 3. Crear la copia del artículo para el carrito.
      const articuloParaCarrito: ArticuloVenta = {
        ...articuloEnInventarioMaestro, // Copia todas las propiedades del artículo original
        PrecioBase: parseFloat(precioConMargen.toFixed(4)), // Precio CON MARGEN para el carrito
        PrecioOriginalSinMargen: precioOriginalSinMargen,   // Guardamos el precio ORIGINAL
        Cantidad: 1, // Para el carrito, la cantidad inicial de esta "línea" es 1
        // DescuentoPorcentaje se inicializará en el servicio de carrito o ya está en 0
      };

      // 4. Si no es servicio, descontar stock del inventario maestro.
      if (!esServicio) {
        articuloEnInventarioMaestro.Cantidad = stockDisponibleInventario - 1;
      }

      // 5. Notificar al servicio del carrito.
      this.carritoService.notificarAgregadoAlCarrito(articuloParaCarrito, esServicio);

      // 6. Actualizar la visualización de grupos (reflejar cambio de stock).
      this.actualizarGrupos();
      this.snackBar.open(`${articuloParaCarrito.NombreArticulo} agregado al carrito.`, 'Cerrar', { duration: 2000 });

    } else {
      this.snackBar.open(`Sin stock para ${articuloEnInventarioMaestro.NombreArticulo}`, 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Agrega un artículo al carrito buscando por código.
   * @param codigo El código del artículo a buscar.
   * @param margenPorcentajeActual El margen de venta actual seleccionado en el Punto de Venta.
   * @returns Estado de la operación.
   */
  public agregarArticuloPorCodigo(codigo: string, margenPorcentajeActual: number): 'AGREGADO' | 'NO_ENCONTRADO' | 'SIN_STOCK' | 'ERROR_CARGA' | 'PRECIO_INVALIDO' {
    if (!this.todosLosArticulosOriginales || this.todosLosArticulosOriginales.length === 0) {
      return 'ERROR_CARGA';
    }

    const articuloEnInventarioMaestro = this.todosLosArticulosOriginales.find(art => art.Codigo === codigo);

    if (!articuloEnInventarioMaestro) {
      return 'NO_ENCONTRADO';
    }

    const esServicio = articuloEnInventarioMaestro.Tipo === 'Servicio';
    const stockDisponibleInventario = articuloEnInventarioMaestro.Cantidad ?? 0;

    if (esServicio || stockDisponibleInventario > 0) {
      // 1. Guardar el precio original ANTES de aplicar el margen.
      // `articuloEnInventarioMaestro.PrecioBase` es el precio original sin margen.
      const precioOriginalSinMargen = articuloEnInventarioMaestro.PrecioBase;

      if (precioOriginalSinMargen === undefined || precioOriginalSinMargen === null) {
        // Si el precio base original no está definido, no podemos calcular el margen.
        console.error(`Artículo ${codigo} no tiene un PrecioBase definido en el inventario maestro.`);
        return 'PRECIO_INVALIDO';
      }

      // 2. Calcular el nuevo PrecioBase CON el margen aplicado.
      const precioConMargen = precioOriginalSinMargen * (1 + (margenPorcentajeActual / 100));

      // 3. Crear la copia del artículo para el carrito.
      const articuloParaCarrito: ArticuloVenta = {
        ...articuloEnInventarioMaestro,
        PrecioBase: parseFloat(precioConMargen.toFixed(4)),
        PrecioOriginalSinMargen: precioOriginalSinMargen,
        Cantidad: 1, // Nueva línea en carrito inicia con 1
      };

      // 4. Si no es servicio, descontar stock del inventario maestro.
      if (!esServicio) {
        articuloEnInventarioMaestro.Cantidad = stockDisponibleInventario - 1;
      }

      // 5. Notificar al servicio del carrito.
      this.carritoService.notificarAgregadoAlCarrito(articuloParaCarrito, esServicio);

      // 6. Actualizar la visualización de grupos.
      this.actualizarGrupos();
      this.snackBar.open(`${articuloParaCarrito.NombreArticulo} agregado por código.`, 'Cerrar', { duration: 2000 });
      return 'AGREGADO';

    } else {
      return 'SIN_STOCK';
    }
  }
}