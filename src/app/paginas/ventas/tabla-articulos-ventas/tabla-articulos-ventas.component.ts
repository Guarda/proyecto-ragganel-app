import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArticuloVenta } from '../../interfaces/articuloventa';
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
  styleUrl: './tabla-articulos-ventas.component.css'
})
export class TablaArticulosVentasComponent implements OnInit, OnDestroy {

  constructor(
    private listadoArticulosVentaService: ListadoArticulosVentaService,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar
  ) { }

  gruposDeArticulos: GrupoArticulos[] = [];
  gruposDeArticulosFiltrados: GrupoArticulos[] = [];
  todosLosArticulosOriginales: ArticuloVenta[] = [];
  private subs = new Subscription();
  tipos: string[] = ['Producto', 'Accesorio', 'Insumo', 'Servicio'];
  tipoSeleccionado: string | null = null;
  precioMin: number = 0;
  precioMax: number = 99999;

  ngOnInit(): void {
    // Añade la suscripción a this.subs
    this.subs.add(this.listadoArticulosVentaService.getAll().subscribe((data: ArticuloVenta[]) => {
      this.todosLosArticulosOriginales = data;
      this.actualizarGrupos();
    }));

    // Añade esta suscripción crucial a this.subs
    this.subs.add(this.carritoService.solicitarAjusteStockInventario$.subscribe(
      ({ codigoArticulo, cantidadDelta, tipoArticulo }) => {
        if (tipoArticulo === 'Servicio') return; // Los servicios no afectan el stock del inventario

        const articuloEnInventario = this.todosLosArticulosOriginales.find(a => a.Codigo === codigoArticulo);
        if (articuloEnInventario) {
          if (cantidadDelta < 0) { // Se intenta TOMAR stock (ej. botón + en carrito)
            if ((articuloEnInventario.Cantidad ?? 0) > 0) {
              articuloEnInventario.Cantidad = (articuloEnInventario.Cantidad ?? 0) + cantidadDelta; // cantidadDelta es -1
              this.actualizarGrupos();
              this.carritoService.confirmarIncrementoEnCarrito(codigoArticulo); // Notificar al servicio que se tomó el stock
            } else {
              // No hay stock para tomar, informar al usuario
              this.snackBar.open(`Sin stock para ${articuloEnInventario.NombreArticulo}`, 'Cerrar', { duration: 3000 });
            }
          } else { // Se DEVUELVE stock (cantidadDelta > 0)
            articuloEnInventario.Cantidad = (articuloEnInventario.Cantidad ?? 0) + cantidadDelta;
            this.actualizarGrupos();
          }
        }
      }
    ));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // Esto ahora cancelará ambas suscripciones hechas en ngOnInit
  }

  actualizarGrupos(): void {
    const grupos: { [nombre: string]: ArticuloVenta[] } = {};
    for (const art of this.todosLosArticulosOriginales) {
      if (art.Tipo === 'Servicio' || (art.Cantidad && art.Cantidad > 0)) {
        if (!grupos[art.NombreArticulo!]) {
          grupos[art.NombreArticulo!] = [];
        }
        grupos[art.NombreArticulo!].push(art);
      }
    }
    this.gruposDeArticulos = Object.keys(grupos).map(nombre => {
      const articulos = grupos[nombre];
      const primerArticulo = articulos[0];
      return {
        nombre,
        articulos,
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

      const cumplePrecio = grupo.articulos.some(a =>
        a.PrecioBase != null && a.PrecioBase >= this.precioMin && a.PrecioBase <= this.precioMax
      );

      return cumpleTipo && cumplePrecio;
    });
  }

  filtrarPorTipo(tipo: string): void {
    this.tipoSeleccionado = this.tipoSeleccionado === tipo ? null : tipo;
    this.aplicarFiltros();
  }

  getImagePath(link: string | null, tipoArticulo: string | null): string {
    const baseUrl = 'http://localhost:3000';
    let folder = '';

    switch (tipoArticulo) {
      case 'Producto':
        folder = 'img-consolas';
        break;
      case 'Accesorio':
        folder = 'img-accesorios';
        break;
      case 'Insumo':
        folder = 'img-insumos';
        break;
      case 'Servicio':
        folder = 'assets';
        break;
      default:
        folder = 'img-consolas'; // O una imagen por defecto genérica
    }
    // Considera una imagen placeholder si link es null y el tipo es desconocido
    return link ? `${baseUrl}/${folder}/${link}` : `${baseUrl}/${folder}/placeholder.jpg`; // Ajusta 'placeholder.jpg'
  }

  // No necesitas devolverAlInventario si el ajuste de stock ya lo maneja la lógica de +/- y eliminar.
  // devolverAlInventario(articulo: ArticuloVenta): void { ... }

  agregarAlCarrito(articuloQueLlega: ArticuloVenta): void {
    const articuloEnInventario = this.todosLosArticulosOriginales.find(a => a.Codigo === articuloQueLlega.Codigo);
    if (!articuloEnInventario) {
      console.error("Error: Artículo no encontrado en el inventario maestro.", articuloQueLlega);
      this.snackBar.open("Error: Artículo no encontrado en inventario.", 'Cerrar', { duration: 3000 });
      return;
    }

    const esServicio = articuloEnInventario.Tipo === 'Servicio';

    if (esServicio || (articuloEnInventario.Cantidad ?? 0) > 0) {
      if (!esServicio) {
        articuloEnInventario.Cantidad = (articuloEnInventario.Cantidad ?? 0) - 1;
      }
      this.carritoService.notificarAgregadoAlCarrito({ ...articuloEnInventario }, esServicio);
      this.actualizarGrupos();
    } else {
      this.snackBar.open(`Sin stock para ${articuloEnInventario.NombreArticulo}`, 'Cerrar', { duration: 3000 });
    }
  }

  public agregarArticuloPorCodigo(codigo: string): 'AGREGADO' | 'NO_ENCONTRADO' | 'SIN_STOCK' | 'ERROR_CARGA' {
    if (!this.todosLosArticulosOriginales || this.todosLosArticulosOriginales.length === 0) return 'ERROR_CARGA';

    const articuloEncontrado = this.todosLosArticulosOriginales.find(art => art.Codigo === codigo);
    if (!articuloEncontrado) return 'NO_ENCONTRADO';

    const esServicio = articuloEncontrado.Tipo === 'Servicio';

    if (esServicio || (articuloEncontrado.Cantidad ?? 0) > 0) {
      if (!esServicio) {
        // Descontar del stock local ANTES de notificar al carrito
        articuloEncontrado.Cantidad = (articuloEncontrado.Cantidad ?? 0) - 1;
      }
      // Crear una copia para el carrito, con Cantidad ajustada a 1 para la nueva línea o para agrupar
      // El servicio carrito se encarga de la lógica de si es nueva línea o incrementa existente.
      this.carritoService.notificarAgregadoAlCarrito({ ...articuloEncontrado, Cantidad: 1 }, esServicio);
      this.actualizarGrupos();
      return 'AGREGADO';
    } else {
      return 'SIN_STOCK';
    }
  }

}
