import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
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


  get totalArticulos(): number {
    return this.dataToDisplay
      .filter(articulo => articulo.Activo === 1) // Filtra solo los artículos activos
      .reduce((total, articulo) => total + (articulo.Cantidad || 0), 0);
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
    this.sharedPedidoService.subtotalarticulosPedido(total);

    // Suscríbete al servicio para obtener el subtotal
    this.sharedPedidoService.SubTotalArticulosPedido$.subscribe((total) => {
      console.log(total);
    });
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

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarArticuloComponent, {
      disableClose: true,
      height: '85%',
      width: '40%',
    });
    dialogRef.afterClosed().subscribe((newArticulo: Articulo) => {
      if (newArticulo) {
        // this.addData(newArticulo);
        switch (newArticulo.TipoArticulo) {
          case 1: // Producto
            // console.log("Producto selected");
            this.getNamesForProducto(newArticulo);
            break;
          case 2: // Accesorio
            // console.log("Accesorio selected");
            this.getNamesForAccesorio(newArticulo);
            break;
          case 3: // Insumo
            this.getNamesForInsumo(newArticulo);
            // console.log("Insumo selected");
            // this.updateCategoriesForInsumo();
            break;
          default:
            console.error("Unknown TipoArticulo selected");
        }
      }
    });
  }

  getNamesForProducto(newArticulo: Articulo) {
    // Fetch the article type name
    this.tipoarticuloService.findById(newArticulo.TipoArticulo.toString()).subscribe((data: TipoArticulo[]) => {
      const fabricante = data.find(item => item.IdTipoArticuloPK === newArticulo.TipoArticulo);
      if (fabricante) {
        // Assign the Fabricante Name to the newArticulo object
        newArticulo.NombreTipoArticulo = fabricante.DescripcionTipoArticulo;
      }
    });

    // Fetch Fabricante Name
    this.fabricanteproductoService.find(newArticulo.Fabricante.toString()).subscribe((data: FabricanteProducto[]) => {
      const fabricante = data.find(item => item.IdFabricantePK === newArticulo.Fabricante);
      if (fabricante) {
        // Assign the Fabricante Name to the newArticulo object
        newArticulo.NombreFabricante = fabricante.NombreFabricante;
      }
    });

    // Fetch Categoria Name
    this.categoriaproductoService.findById(newArticulo.Cate.toString()).subscribe((data: categoriasProductos[]) => {
      const categoria = data.find(item => item.IdCategoriaPK === newArticulo.Cate);
      if (categoria) {
        // Assign the Categoria Name to the newArticulo object
        newArticulo.NombreCategoria = categoria.NombreCategoria;
      }
    });

    // Fetch SubCategoria Name
    this.subcategoriaproductoService.findById(newArticulo.SubCategoria.toString()).subscribe((data: SubcategoriasProductos[]) => {
      console.log('subcategoria' + data[0])
      const subcategoria = data.find(item => item.IdSubcategoria === newArticulo.SubCategoria);
      if (subcategoria) {
        console.log(subcategoria)
        // Assign the SubCategoria Name to the newArticulo object
        newArticulo.NombreSubCategoria = subcategoria.NombreSubCategoria;
      }
    });

    this.cateproductoService.find(newArticulo.IdModeloPK.toString()).subscribe((data) => {
      // console.log(data)
      this.ImagePath = this.getImagePath(data[0].LinkImagen, newArticulo.TipoArticulo);
      newArticulo.ImagePath = this.ImagePath;
      this.cdr.detectChanges();
    });


    // After the data is fetched and updated, you can add the articulo to the display list
    this.addData(newArticulo);
  }

  getNamesForAccesorio(newArticulo: Articulo) {

    // Fetch the article type name
    this.tipoarticuloService.findById(newArticulo.TipoArticulo.toString()).subscribe((data: TipoArticulo[]) => {
      const fabricante = data.find(item => item.IdTipoArticuloPK === newArticulo.TipoArticulo);
      if (fabricante) {
        // Assign the Fabricante Name to the newArticulo object
        newArticulo.NombreTipoArticulo = fabricante.DescripcionTipoArticulo;
      }
    });

    // Fetch Fabricante Name
    this.fabricanteaccesorioService.find(newArticulo.Fabricante.toString()).subscribe((data: FabricanteAccesorio[]) => {
      const fabricante = data.find(item => item.IdFabricanteAccesorioPK === newArticulo.Fabricante);
      if (fabricante) {
        // Assign the Fabricante Name to the newArticulo object
        newArticulo.NombreFabricante = fabricante.NombreFabricanteAccesorio;
      }
    });

    // Fetch Categoria Name
    this.categoriaaccesorioService.findById(newArticulo.Cate.toString()).subscribe((data: categoriasAccesorios[]) => {
      const categoria = data.find(item => item.IdCategoriaAccesorioPK === newArticulo.Cate);
      if (categoria) {
        // Assign the Categoria Name to the newArticulo object
        newArticulo.NombreCategoria = categoria.NombreCategoriaAccesorio;
      }
    });

    // Fetch SubCategoria Name
    this.subcategoriaaccesorioService.findById(newArticulo.SubCategoria.toString()).subscribe((data: SubcategoriasAccesorios[]) => {
      console.log('subcategoria' + data[0])
      const subcategoria = data.find(item => item.IdSubcategoriaAccesorio === newArticulo.SubCategoria);
      if (subcategoria) {
        console.log(subcategoria)
        // Assign the SubCategoria Name to the newArticulo object
        newArticulo.NombreSubCategoria = subcategoria.NombreSubcategoriaAccesorio;
      }
    });

    this.cateaccesorioService.find(newArticulo.IdModeloPK.toString()).subscribe((data) => {
      // console.log(data)
      this.ImagePath = this.getImagePath(data[0].LinkImagen, newArticulo.TipoArticulo);
      newArticulo.ImagePath = this.ImagePath;
      this.cdr.detectChanges();
    });

    // After the data is fetched and updated, you can add the articulo to the display list
    this.addData(newArticulo);
  }

  getNamesForInsumo(newArticulo: Articulo) {

    // Fetch the article type name
    this.tipoarticuloService.findById(newArticulo.TipoArticulo.toString()).subscribe((data: TipoArticulo[]) => {
      const fabricante = data.find(item => item.IdTipoArticuloPK === newArticulo.TipoArticulo);
      if (fabricante) {
        // Assign the Fabricante Name to the newArticulo object
        newArticulo.NombreTipoArticulo = fabricante.DescripcionTipoArticulo;
      }
    });

    // Fetch Fabricante Name
    this.fabricanteinsumoService.find(newArticulo.Fabricante.toString()).subscribe((data: FabricanteInsumos[]) => {
      const fabricante = data.find(item => item.IdFabricanteInsumosPK === newArticulo.Fabricante);
      if (fabricante) {
        // Assign the Fabricante Name to the newArticulo object
        newArticulo.NombreFabricante = fabricante.NombreFabricanteInsumos;
      }
    });

    // Fetch Categoria Name
    this.categoriainsumoService.findById(newArticulo.Cate.toString()).subscribe((data: categoriasInsumos[]) => {
      const categoria = data.find(item => item.IdCategoriaInsumosPK === newArticulo.Cate);
      if (categoria) {
        // Assign the Categoria Name to the newArticulo object
        newArticulo.NombreCategoria = categoria.NombreCategoriaInsumos;
      }
    });

    // Fetch SubCategoria Name
    this.subcategoriainsumoService.findById(newArticulo.SubCategoria.toString()).subscribe((data: SubcategoriasInsumos[]) => {
      console.log('subcategoria' + data[0])
      const subcategoria = data.find(item => item.IdCategoriaInsumosFK === newArticulo.SubCategoria);
      if (subcategoria) {
        console.log(subcategoria)
        // Assign the SubCategoria Name to the newArticulo object
        newArticulo.NombreSubCategoria = subcategoria.NombreSubcategoriaInsumos;
      }
    });

    this.cateinsumoService.find(newArticulo.IdModeloPK.toString()).subscribe((data) => {
      // console.log(data)
      this.ImagePath = this.getImagePath(data[0].LinkImagen, newArticulo.TipoArticulo);
      newArticulo.ImagePath = this.ImagePath;
      this.cdr.detectChanges();
    });

    // After the data is fetched and updated, you can add the articulo to the display list
    this.addData(newArticulo);
  }


  addData(newArticulo: Articulo) {
    this.dataToDisplay = [...this.dataToDisplay, newArticulo];
    this.dataSource.setData(this.dataToDisplay);
    this.updateSharedTotal(); // Actualiza el total compartido
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
    this.updateSharedTotal(); // Actualiza el total compartido
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