import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { catchError, forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { SharedPedidoService } from '../../../../services/shared-pedido.service';


import { AgregarArticuloComponent } from '../agregar-articulo/agregar-articulo.component';
import { TarjetaArticuloComponent } from '../tarjeta-articulo/tarjeta-articulo.component';

import { MatDialog } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Articulo } from '../../../interfaces/articulo-pedido';

//CATEGORIAS / PRODUCTOS / ACCESORIOS / INSUMOS
import { CategoriasConsolas } from '../../../interfaces/categorias';
import { CategoriasConsolasService } from '../../../../services/categorias-consolas.service';

import { CategoriasAccesoriosBase } from '../../../interfaces/categoriasaccesoriosbase';
import { CategoriasAccesoriosService } from '../../../../services/categorias-accesorios.service';

import { CategoriasInsumosBase } from '../../../interfaces/categoriasinsumosbase';
import { CategoriasInsumosService } from '../../../../services/categorias-insumos.service';

//FABRICANTES
import { FabricanteService } from '../../../../services/fabricante.service';
import { FabricanteProducto } from '../../../interfaces/fabricantesproductos';

import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { FabricanteAccesorio } from '../../../interfaces/fabricantesaccesorios';

import { FabricanteInsumoService } from '../../../../services/fabricante-insumo.service';
import { FabricanteInsumos } from '../../../interfaces/fabricantesinsumos';
//CATEGORIAS
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { categoriasProductos } from '../../../interfaces/categoriasproductos';

import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { categoriasAccesorios } from '../../../interfaces/categoriasaccesorios';

import { CategoriaInsumoService } from '../../../../services/categoria-insumo.service';
import { categoriasInsumos } from '../../../interfaces/categoriasinsumos';
//SUBCATEGORIAS

import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { SubcategoriasProductos } from '../../../interfaces/subcategoriasproductos';

import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';
import { SubcategoriasAccesorios } from '../../../interfaces/subcategoriasaccesorios';

import { SubcategoriaInsumoService } from '../../../../services/subcategoria-insumo.service';
import { SubcategoriasInsumos } from '../../../interfaces/subcategoriasinsumos';

//Tipo Articulo
import { TipoArticuloService } from '../../../../services/tipo-articulo.service';
import { TipoArticulo } from '../../../interfaces/tipoarticulos';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-index-listado-articulos',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CurrencyPipe, MatIcon, TarjetaArticuloComponent, CommonModule],
  templateUrl: './index-listado-articulos.component.html',
  styleUrl: './index-listado-articulos.component.css'
})
export class IndexListadoArticulosComponent {
  displayedColumns: string[] = [
    'TipoArticulo', 'Fabricante', 'Cate', 'SubCategoria',
    'EnlaceCompra', 'Cantidad', 'Precio', 'Acciones'
  ];

  @Input() dataToDisplay: Articulo[] = [];
  public ImagePath: any;
  tipoArticulo: any;

  selectedFabricante: any;
  selectedCategoria: any;
  selectedSubcategoria: any;

  dataSource = new ExampleDataSource(this.dataToDisplay);
  @Output() subtotalCambiado = new EventEmitter<number>();

  constructor(private dialog: MatDialog,
    public sharedPedidoService: SharedPedidoService,
    //
    private fabricanteproductoService: FabricanteService,
    private fabricanteaccesorioService: FabricanteAccesorioService,
    private fabricanteinsumoService: FabricanteInsumoService,
    //
    private categoriaproductoService: CategoriaProductoService,
    private categoriaaccesorioService: CategoriaAccesorioService,
    private categoriainsumoService: CategoriaInsumoService,
    //
    private subcategoriaproductoService: SubcategoriaProductoService,
    private subcategoriaaccesorioService: SubcategoriaAccesorioService,
    private subcategoriainsumoService: SubcategoriaInsumoService,
    //
    private tipoarticuloService: TipoArticuloService,
    //
    private cateproductoService: CategoriasConsolasService,
    private cateaccesorioService: CategoriasAccesoriosService,
    private cateinsumoService: CategoriasInsumosService,
    private cdr: ChangeDetectorRef
  ) {
    // this.updateSharedTotal();
  }


  // En index-listado-articulos.component.ts

  get totalArticulos(): number {
    // Simplemente cuenta cuántos artículos activos hay en la lista
    return this.activeArticulos.length;
  }

  get totalPrecio(): number {
    return this.dataToDisplay
      .filter(articulo => articulo.Activo === 1) // Filtra solo los artículos activos
      .reduce((total, articulo) => total + (articulo.Precio * articulo.Cantidad || 0), 0);
  }



  // removeArticulo(articulo: Articulo) {
  //   this.dataToDisplay = this.dataToDisplay.filter(item => item !== articulo);
  //   this.dataSource.setData(this.dataToDisplay);
  //   this.updateSharedTotal(); // Actualiza el total compartido
  // }

  //Si deseas marcar el artículo como inactivo cambiando el valor del campo Activo a 0, en lugar de eliminarlo del arreglo, puedes modificar el método removeArticulo para actualizar el valor del campo correspondiente. Aquí tienes cómo hacerlo:

  removeArticulo(articulo: Articulo) {
    // Encuentra el artículo en el arreglo y cambia su valor de Activo a false
    const index = this.dataToDisplay.findIndex(item => item === articulo);
    if (index !== -1) {
      this.dataToDisplay[index].Activo = 0; // Cambia el campo Activo a false
      console.log(this.dataToDisplay[index])
    }

    // Actualiza la fuente de datos
    this.dataSource.setData(this.dataToDisplay);

    // Actualiza el total compartido
    this.updateSharedTotal();
  }

  get activeArticulos(): Articulo[] {
    // Filtra los artículos donde Activo sea true
    // console.log(this.dataToDisplay)
    return this.dataToDisplay.filter(articulo => articulo.Activo === 1);
  }
  private updateSharedTotal() {
    const total = this.totalPrecio;

    // ====== ACCIÓN 1: ACTUALIZAR EL SERVICIO ======
    // Esto asegura que 'agregar-pedido' siga recibiendo el subtotal.
    this.sharedPedidoService.subtotalarticulosPedido(total);

    // ====== ACCIÓN 2: EMITIR EL EVENTO ======
    // Esto asegura que 'ver-pedido' reciba el subtotal.
    this.subtotalCambiado.emit(total);
  }

  // Método para escuchar el evento de actualización de la cantidad
  actualizarCantidadArticulo(nuevaCantidad: number, articulo: Articulo) {
    // Aquí actualizas la cantidad del artículo correspondiente
    const index = this.dataToDisplay.findIndex(item => item === articulo);
    if (index !== -1) {
      console.log("cambio")
      this.dataToDisplay[index].Cantidad = nuevaCantidad; // Actualiza la cantidad
      this.dataSource.setData(this.dataToDisplay); // Actualiza los datos en el DataSource
    }
    this.updateSharedTotal();
  }

  public openDialogAgregar(): void {
    const dialogRef = this.dialog.open(AgregarArticuloComponent, { /* ... tus opciones ... */ });
    dialogRef.afterClosed().subscribe((newArticulo: Articulo) => {
      if (newArticulo) {
        // La lógica principal se mueve a los métodos getNamesFor...
        switch (newArticulo.TipoArticulo) {
          case 1: this.getNamesForProducto(newArticulo); break;
          case 2: this.getNamesForAccesorio(newArticulo); break; // Implementar con forkJoin
          case 3: this.getNamesForInsumo(newArticulo); break;    // Implementar con forkJoin
        }
      }
    });
  }

  getNamesForProducto(newArticulo: Articulo): void {
    // 1. Preparamos todas las llamadas a los servicios que necesitamos
    const calls = {
      tipo: this.tipoarticuloService.findById(newArticulo.TipoArticulo.toString()),
      fabricante: this.fabricanteproductoService.find(newArticulo.Fabricante.toString()),
      categoria: this.categoriaproductoService.findById(newArticulo.Cate.toString()),
      subcategoria: this.subcategoriaproductoService.findById(newArticulo.SubCategoria.toString()),
      modelo: this.cateproductoService.find(newArticulo.IdModeloPK.toString()).pipe(
        // Usamos catchError para que si esta llamada falla, no cancele las demás.
        catchError(() => of([])) // Devuelve un arreglo vacío en caso de error
      )
    };

    // 2. Ejecutamos todas las llamadas en paralelo y esperamos a que terminen
    forkJoin(calls).subscribe(results => {
      // 3. Asignamos los nombres y la imagen de forma segura
      // El resultado de cada llamada está en 'results' con la clave que le dimos
      if (results.tipo && results.tipo.length > 0) {
        newArticulo.NombreTipoArticulo = results.tipo[0].DescripcionTipoArticulo;
      }
      if (results.fabricante && results.fabricante.length > 0) {
        newArticulo.NombreFabricante = results.fabricante[0].NombreFabricante;
      }
      if (results.categoria && results.categoria.length > 0) {
        newArticulo.NombreCategoria = results.categoria[0].NombreCategoria;
      }
      if (results.subcategoria && results.subcategoria.length > 0) {
        newArticulo.NombreSubCategoria = results.subcategoria[0].NombreSubCategoria;
      }

      // Verificación de seguridad para la imagen
      if (results.modelo && results.modelo.length > 0) {
        newArticulo.ImagePath = this.getImagePath(results.modelo[0].LinkImagen, newArticulo.TipoArticulo);
      } else {
        newArticulo.ImagePath = this.getImagePath(null, newArticulo.TipoArticulo);
      }

      // 4. SOLO AHORA, con todos los datos listos, agregamos el artículo a la lista
      this.addData(newArticulo);
      this.cdr.detectChanges(); // Forzamos la detección de cambios por si acaso
    });
  }

  getNamesForAccesorio(newArticulo: Articulo): void {
    // 1. Preparamos todas las llamadas a los servicios de accesorios
    const calls = {
      tipo: this.tipoarticuloService.findById(newArticulo.TipoArticulo.toString()),
      fabricante: this.fabricanteaccesorioService.find(newArticulo.Fabricante.toString()),
      categoria: this.categoriaaccesorioService.findById(newArticulo.Cate.toString()),
      subcategoria: this.subcategoriaaccesorioService.findById(newArticulo.SubCategoria.toString()),
      modelo: this.cateaccesorioService.find(newArticulo.IdModeloPK.toString()).pipe(
        // En caso de que no se encuentre una imagen, devolvemos un arreglo vacío
        catchError(() => of([]))
      )
    };

    // 2. Ejecutamos todas las llamadas en paralelo
    forkJoin(calls).subscribe(results => {
      // 3. Asignamos los nombres y la imagen de forma segura
      if (results.tipo && results.tipo.length > 0) {
        newArticulo.NombreTipoArticulo = results.tipo[0].DescripcionTipoArticulo;
      }
      if (results.fabricante && results.fabricante.length > 0) {
        newArticulo.NombreFabricante = results.fabricante[0].NombreFabricanteAccesorio;
      }
      if (results.categoria && results.categoria.length > 0) {
        newArticulo.NombreCategoria = results.categoria[0].NombreCategoriaAccesorio;
      }
      if (results.subcategoria && results.subcategoria.length > 0) {
        newArticulo.NombreSubCategoria = results.subcategoria[0].NombreSubcategoriaAccesorio;
      }

      // Verificación de seguridad para la imagen
      if (results.modelo && results.modelo.length > 0) {
        newArticulo.ImagePath = this.getImagePath(results.modelo[0].LinkImagen, newArticulo.TipoArticulo);
      } else {
        newArticulo.ImagePath = this.getImagePath(null, newArticulo.TipoArticulo);
      }

      // 4. Agregamos el artículo a la lista, ahora con toda su información
      this.addData(newArticulo);
      this.cdr.detectChanges();
    });
  }

  getNamesForInsumo(newArticulo: Articulo): void {
    // 1. Preparamos todas las llamadas a los servicios de insumos
    const calls = {
      tipo: this.tipoarticuloService.findById(newArticulo.TipoArticulo.toString()),
      fabricante: this.fabricanteinsumoService.find(newArticulo.Fabricante.toString()),
      categoria: this.categoriainsumoService.findById(newArticulo.Cate.toString()),
      subcategoria: this.subcategoriainsumoService.findById(newArticulo.SubCategoria.toString()),
      modelo: this.cateinsumoService.find(newArticulo.IdModeloPK.toString()).pipe(
        // En caso de que no se encuentre una imagen, devolvemos un arreglo vacío
        catchError(() => of([]))
      )
    };

    // 2. Ejecutamos todas las llamadas en paralelo
    forkJoin(calls).subscribe(results => {
      // 3. Asignamos los nombres y la imagen de forma segura
      if (results.tipo && results.tipo.length > 0) {
        newArticulo.NombreTipoArticulo = results.tipo[0].DescripcionTipoArticulo;
      }
      if (results.fabricante && results.fabricante.length > 0) {
        newArticulo.NombreFabricante = results.fabricante[0].NombreFabricanteInsumos;
      }
      if (results.categoria && results.categoria.length > 0) {
        newArticulo.NombreCategoria = results.categoria[0].NombreCategoriaInsumos;
      }
      if (results.subcategoria && results.subcategoria.length > 0) {
        newArticulo.NombreSubCategoria = results.subcategoria[0].NombreSubcategoriaInsumos;
      }

      // Verificación de seguridad para la imagen
      if (results.modelo && results.modelo.length > 0) {
        newArticulo.ImagePath = this.getImagePath(results.modelo[0].LinkImagen, newArticulo.TipoArticulo);
      } else {
        newArticulo.ImagePath = this.getImagePath(null, newArticulo.TipoArticulo);
      }

      // 4. Agregamos el artículo a la lista, ahora con toda su información
      this.addData(newArticulo);
      this.cdr.detectChanges();
    });
  }

  addData(newArticulo: Articulo): void {
    this.dataToDisplay = [...this.dataToDisplay, newArticulo];
    this.dataSource.setData(this.dataToDisplay);
    this.updateSharedTotal();
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
    this.updateSharedTotal(); // Actualiza el total compartido
  }

  public openDialogEditar(articuloAEditar: Articulo, index: number) {
    const dialogRef = this.dialog.open(AgregarArticuloComponent, {
      disableClose: true,
      height: '85%',
      width: '40%',
      data: {
        articulo: articuloAEditar,
        isEditMode: true // <-- Bandera para indicar que es modo edición
      }
    });

    dialogRef.afterClosed().subscribe((articuloEditado: Articulo) => {
      if (articuloEditado) {
        // En lugar de agregar, actualizamos el artículo existente en el arreglo
        // Usamos el 'index' para mayor seguridad
        this.dataToDisplay[index] = { ...this.dataToDisplay[index], ...articuloEditado };
        this.dataSource.setData(this.dataToDisplay);
        this.updateSharedTotal();
      }
    });
  }


  // Función para construir la ruta de la imagen
  getImagePath(link: string | null, tipoArticulo: number | null) {
    // console.log(link)
    // console.log(tipoArticulo)
    const baseUrl = 'http://localhost:3000';
    let folder = '';

    switch (tipoArticulo) {
      case 1: // Producto
        folder = 'img-consolas';
        break;
      case 2: // Accesorio
        folder = 'img-accesorios';
        break;
      case 3: // Insumo
        folder = 'img-insumos';
        break;
      default:
        folder = 'img-consolas'; // Carpeta por defecto
    }

    return link ? `${baseUrl}/${folder}/${link}` : `${baseUrl}/${folder}/2ds.jpg`;
  }


}

class ExampleDataSource extends DataSource<Articulo> {
  private _dataStream = new ReplaySubject<Articulo[]>();

  constructor(initialData: Articulo[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Articulo[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: Articulo[]) {
    this._dataStream.next(data);
  }
}