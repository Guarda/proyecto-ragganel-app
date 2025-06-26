import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

// Componentes y Modelos necesarios
import { TarjetaDeArticulosComponent } from '../tarjeta-de-articulos/tarjeta-de-articulos.component';
// import { ArticuloVenta, GrupoArticulos } from 'src/app/models/articulo-venta';
import { ArticuloVenta } from '../../interfaces/articuloventa';
import { GrupoArticulos } from '../../interfaces/grupoarticuloventa';
import { Cliente } from '../../interfaces/clientes';
import { Usuarios } from '../../interfaces/usuarios';

// Servicios necesarios
import { ListadoArticulosVentaService } from '../../../services/listado-articulos-venta.service';
import { CarritoService } from '../../../services/carrito.service';
import { VentasBaseService } from '../../../services/ventas-base.service';

@Component({
  selector: 'app-tabla-articulos-ventas',
  standalone: true,
  imports: [TarjetaDeArticulosComponent, CommonModule, FormsModule],
  templateUrl: './tabla-articulos-ventas.component.html',
  styleUrls: ['./tabla-articulos-ventas.component.css']
})

export class TablaArticulosVentasComponent implements OnInit, OnDestroy, OnChanges { // Added OnChanges

  @Input() margenActual: number | null = 0;
  @Input() clienteSeleccionado: Cliente | null = null;
  @Input() usuario: Usuarios | null = null;

  gruposDeArticulos: GrupoArticulos[] = [];
  gruposDeArticulosFiltrados: GrupoArticulos[] = [];
  todosLosArticulosOriginales: ArticuloVenta[] = [];
  
  private subs = new Subscription();
  tipos: string[] = ['Producto', 'Accesorio', 'Insumo', 'Servicio'];
  tipoSeleccionado: string | null = null;
  precioMin: number = 0;
  precioMax: number = 99999;
  searchTerm: string = '';

  constructor(
    private listadoArticulosVentaService: ListadoArticulosVentaService,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.subs.add(this.listadoArticulosVentaService.getAll().subscribe({
      next: (data: ArticuloVenta[]) => {
        this.todosLosArticulosOriginales = data.map(articulo => ({
          ...articulo,
          PrecioOriginalSinMargen: articulo.PrecioBase
        }));
        this.aplicarMargenYActualizarGrupos();
      },
      error: (err) => console.error('Error al cargar artículos:', err)
    }));

    this.subs.add(this.carritoService.solicitarAjusteStockInventario$.subscribe(
      ({ codigoArticulo, cantidadDelta, tipoArticulo }) => {
        if (tipoArticulo === 'Servicio') return;

        const articuloEnInventario = this.todosLosArticulosOriginales.find(a => a.Codigo === codigoArticulo && a.Tipo === tipoArticulo);
        if (articuloEnInventario) {
          articuloEnInventario.Cantidad = (articuloEnInventario.Cantidad ?? 0) + cantidadDelta;
          this.aplicarMargenYActualizarGrupos();
        }
      }
    ));

    this.subs.add(this.carritoService.solicitarRecargaArticulos$.subscribe(() => {
      this.recargarArticulos();
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['margenActual'] && this.todosLosArticulosOriginales.length > 0) {
      this.aplicarMargenYActualizarGrupos();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private aplicarMargenYActualizarGrupos(): void {
    const articulosConMargenAplicado = this.todosLosArticulosOriginales.map(articulo => {
      const precioOriginal = articulo.PrecioOriginalSinMargen ?? 0;
      const precioConMargen = precioOriginal * (1 + ((this.margenActual ?? 0) / 100));
      return {
        ...articulo,
        PrecioBase: parseFloat(precioConMargen.toFixed(4))
      };
    });

    const grupos: { [nombre: string]: ArticuloVenta[] } = {};
    for (const art of articulosConMargenAplicado) {
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

  // --- MÉTODO CENTRAL PARA AGREGAR ---
  private procesarYEnviarArticulo(articuloMaestro: ArticuloVenta): void {
    if (!this.clienteSeleccionado || !this.usuario || this.margenActual === null) {
      this.snackBar.open('Error: Debe seleccionar cliente, usuario y margen.', 'Cerrar', { duration: 4000 });
      return;
    }
    
    if (articuloMaestro.Tipo !== 'Servicio' && (articuloMaestro.Cantidad ?? 0) <= 0) {
      this.snackBar.open(`Sin stock para ${articuloMaestro.NombreArticulo}`, 'Cerrar', { duration: 3000 });
      return;
    }

    const precioOriginal = articuloMaestro.PrecioOriginalSinMargen ?? articuloMaestro.PrecioBase;
    if (precioOriginal === undefined || precioOriginal === null) {
        this.snackBar.open(`El artículo no tiene un precio base válido.`, 'Cerrar', { duration: 4000 });
        return;
    }
    
    const precioConMargen = (precioOriginal ?? 0) * (1 + (this.margenActual / 100));
    const articuloParaCarrito: ArticuloVenta = {
      ...articuloMaestro,
      PrecioBase: parseFloat(precioConMargen.toFixed(4)),
      PrecioOriginalSinMargen: precioOriginal,
    };

    // Delegar toda la lógica al servicio
    this.carritoService.notificarAgregadoAlCarrito(articuloParaCarrito, this.usuario, this.clienteSeleccionado);
  }

  // --- MÉTODOS PÚBLICOS DE INTERFAZ ---
  public agregarAlCarrito(articuloOriginalDesdeUI: ArticuloVenta): void {
    this.procesarYEnviarArticulo(articuloOriginalDesdeUI);
  }

  public agregarArticuloPorCodigo(codigo: string): void {
    const articuloMaestro = this.todosLosArticulosOriginales.find(art => art.Codigo === codigo);
    if (!articuloMaestro) {
      this.snackBar.open(`Artículo con código "${codigo}" no encontrado.`, 'Cerrar', { duration: 3000 });
      return;
    }
    this.procesarYEnviarArticulo(articuloMaestro);
  }
  
  // --- MÉTODOS DE FILTRADO Y VISUALIZACIÓN ---
  aplicarFiltros(): void {
    let tempGrupos = this.gruposDeArticulos;

    if (this.tipoSeleccionado) {
      tempGrupos = tempGrupos.filter(g => g.articulos.some(a => a.Tipo === this.tipoSeleccionado));
    }
    
    tempGrupos = tempGrupos.filter(g => g.articulos.some(a => {
      const price = a.PrecioBase ?? 0;
      return price >= this.precioMin && price <= this.precioMax;
    }));

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      tempGrupos = tempGrupos.filter(g =>
        g.nombre.toLowerCase().includes(term) ||
        g.articulos.some(a => a.Codigo?.toLowerCase().includes(term))
      );
    }
    this.gruposDeArticulosFiltrados = tempGrupos;
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
    console.log('Recargando lista completa de artículos desde el servidor...');
    this.subs.add(this.listadoArticulosVentaService.getAll().subscribe({
      next: (data: ArticuloVenta[]) => {
        this.todosLosArticulosOriginales = data.map(articulo => ({
          ...articulo,
          PrecioOriginalSinMargen: articulo.PrecioBase
        }));
        this.aplicarMargenYActualizarGrupos(); // Esto redibuja la lista con el stock actualizado
        this.snackBar.open('Lista de artículos actualizada.', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error al recargar la lista de artículos:', err);
        this.snackBar.open('No se pudo refrescar la lista de artículos.', 'Cerrar', { duration: 3000 });
      }
    }));
  }

  getImagePath(link: string | null, tipo: string | null): string {
    const baseUrl = 'http://localhost:3000';
    let folder = 'img-genericas';
    switch (tipo) {
      case 'Producto': folder = 'img-consolas'; break;
      case 'Accesorio': folder = 'img-accesorios'; break;
      case 'Insumo': folder = 'img-insumos'; break;
      case 'Servicio': folder = 'assets'; break;
    }
    return link ? `${baseUrl}/${folder}/${link}` : `${baseUrl}/assets/placeholder.png`;
  }
}