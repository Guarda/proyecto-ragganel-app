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

export class TablaArticulosVentasComponent implements OnInit, OnDestroy { // Added OnChanges

  @Input() margenActual: number | null = 0;
  @Input() idMargenActual: number | null = null;
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
    private snackBar: MatSnackBar,
    private ventasBaseService: VentasBaseService
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

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['margenActual'] && this.todosLosArticulosOriginales.length > 0) {
  //     this.aplicarMargenYActualizarGrupos();
  //   }
  // }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private aplicarMargenYActualizarGrupos(): void {
    const articulosConMargenAplicado = this.todosLosArticulosOriginales.map(articulo => {
      // Tomamos el costo original, que ahora sabemos que está seguro en PrecioBase.
      const precioOriginal = articulo.PrecioBase ?? 0;
      const precioConMargen = precioOriginal * (1 + ((this.margenActual ?? 0) / 100));

      // En lugar de sobrescribir PrecioBase, creamos una nueva propiedad para el precio de venta.
      return {
        ...articulo,
        PrecioVentaDisplay: parseFloat(precioConMargen.toFixed(4)) // Nueva propiedad para la UI
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

  private procesarYEnviarArticulo(articuloDesdeUI: ArticuloVenta): void {
    // 1. Validaciones (cliente, usuario, margen seleccionado) - Sin cambios
    if (!this.clienteSeleccionado || !this.usuario || this.margenActual === null || this.idMargenActual === null) {
      this.snackBar.open('Error: Debe seleccionar cliente, usuario y margen.', 'Cerrar', { duration: 4000 });
      return;
    }

    // =============================================================
    // ## INICIO DE LA CORRECCIÓN DEFINITIVA ##

    // 2. ¡NO CONFÍES EN EL ARTÍCULO DE LA UI!
    // Usa el código del artículo de la UI para encontrar el artículo ORIGINAL y PURO
    // en nuestra lista maestra, que nunca se modifica.
    const articuloOriginalMaestro = this.todosLosArticulosOriginales.find(a => a.Codigo === articuloDesdeUI.Codigo);

    if (!articuloOriginalMaestro) {
      this.snackBar.open('Error crítico: No se pudo encontrar el artículo original en la lista maestra.', 'Cerrar', { duration: 4000 });
      return;
    }

    // 3. Ahora, TODOS los cálculos se basan en el costo 100% fiable del artículo maestro.
    const precioOriginal = articuloOriginalMaestro.PrecioBase ?? 0; // Este es el costo puro.

    // 4. Validar stock usando el artículo maestro (que tiene el stock real)
    if (articuloOriginalMaestro.Tipo !== 'Servicio' && (articuloOriginalMaestro.Cantidad ?? 0) <= 0) {
      this.snackBar.open(`Sin stock para ${articuloOriginalMaestro.NombreArticulo}`, 'Cerrar', { duration: 3000 });
      return;
    }

    // ## FIN DE LA CORRECCIÓN DEFINITIVA ##
    // =============================================================

    const precioVentaFinal = precioOriginal * (1 + (this.margenActual / 100));

    const datosParaBackend = {
      IdUsuario: this.usuario.id,
      IdCliente: this.clienteSeleccionado.id,
      TipoArticulo: articuloOriginalMaestro.Tipo!,
      CodigoArticulo: articuloOriginalMaestro.Codigo!,
      PrecioVenta: precioVentaFinal,
      Descuento: 0,
      Cantidad: 1,
      PrecioBaseOriginal: precioOriginal, // <-- GARANTIZADO que es el costo correcto
      MargenAplicado: this.margenActual,
      IdMargenFK: this.idMargenActual
    };

    // La llamada al servicio no cambia
    this.subs.add(
      this.ventasBaseService.agregarArticuloAlCarrito(datosParaBackend).subscribe({
        // ... (código de next y error no cambia)
        next: (respuesta) => {
          if (respuesta.success) {
            this.snackBar.open(`'${articuloOriginalMaestro.NombreArticulo}' agregado al carrito.`, 'OK', { duration: 3000 });
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
    const lowerCaseSearch = this.searchTerm.toLowerCase();

    // Filtramos la lista completa de grupos en un solo paso
    this.gruposDeArticulosFiltrados = this.gruposDeArticulos.filter(grupo => {

      // Condición 1: Filtro por Tipo de Artículo
      const tipoMatch = !this.tipoSeleccionado || grupo.articulos[0].Tipo === this.tipoSeleccionado;

      // Condición 2: Filtro por Precio
      // Usa la nueva propiedad 'PrecioVentaDisplay' para la comparación
      const precioMatch = grupo.articulos.some(a => {
        const price = a.PrecioVentaDisplay ?? 0;
        return price >= this.precioMin && price <= this.precioMax;
      });

      // Condición 3: Filtro por Término de Búsqueda (en nombre o código)
      const searchMatch = !this.searchTerm ||
        grupo.nombre.toLowerCase().includes(lowerCaseSearch) ||
        grupo.articulos.some(a => a.Codigo?.toLowerCase().includes(lowerCaseSearch));

      // Un grupo se muestra solo si cumple TODAS las condiciones activas
      return tipoMatch && precioMatch && searchMatch;
    });
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