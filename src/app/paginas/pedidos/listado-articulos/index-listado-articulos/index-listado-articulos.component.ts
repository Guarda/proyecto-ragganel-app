import { ChangeDetectorRef, Component } from '@angular/core';
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



//FABRICANTES
import { FabricanteService } from '../../../../services/fabricante.service';
import { FabricanteProducto } from '../../../interfaces/fabricantesproductos';

import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { FabricanteAccesorio } from '../../../interfaces/fabricantesaccesorios';


//CATEGORIAS
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { categoriasProductos } from '../../../interfaces/categoriasproductos';

import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { categoriasAccesorios } from '../../../interfaces/categoriasaccesorios';

//SUBCATEGORIAS

import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { SubcategoriasProductos } from '../../../interfaces/subcategoriasproductos';

import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';
import { SubcategoriasAccesorios } from '../../../interfaces/subcategoriasaccesorios';


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

  public ImagePath: any;
  tipoArticulo: any;
  dataToDisplay: Articulo[] = [];

  selectedFabricante: any;
  selectedCategoria: any;
  selectedSubcategoria: any;

  dataSource = new ExampleDataSource(this.dataToDisplay);

  constructor(private dialog: MatDialog,
    public sharedPedidoService: SharedPedidoService,
    private fabricanteproductoService: FabricanteService,
    private fabricanteaccesorioService: FabricanteAccesorioService,
    private categoriaproductoService: CategoriaProductoService,
    private categoriaaccesorioService: CategoriaAccesorioService,
    private subcategoriaproductoService: SubcategoriaProductoService,
    private subcategoriaaccesorioService: SubcategoriaAccesorioService,
    private tipoarticuloService: TipoArticuloService,
    private cateproductoService: CategoriasConsolasService,
    private cateaccesorioService: CategoriasAccesoriosService,
    private cdr: ChangeDetectorRef
  ) {
    this.updateSharedTotal();
  }

  
  get totalArticulos(): number {
    return this.dataToDisplay.reduce((total, articulo) => total + (articulo.Cantidad || 0), 0);
  }
  
  get totalPrecio(): number {
    return this.dataToDisplay.reduce((total, articulo) => total + (articulo.Precio || 0), 0);
  }

  removeArticulo(articulo: Articulo) {
    this.dataToDisplay = this.dataToDisplay.filter(item => item !== articulo);
    this.dataSource.setData(this.dataToDisplay);
    this.updateSharedTotal(); // Actualiza el total compartido
  }

  private updateSharedTotal() {
    const total = this.totalPrecio;
    this.sharedPedidoService.subtotalarticulosPedido(total);

    // Suscríbete al servicio para obtener el subtotal
    this.sharedPedidoService.SubTotalArticulosPedido$.subscribe((total) => {
      console.log(total);
    });
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
    this.tipoarticuloService.findById(newArticulo.TipoArticulo.toString()).subscribe((data: TipoArticulo[]) =>{
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
      console.log('subcategoria'+ data[0]  )      
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
    this.tipoarticuloService.findById(newArticulo.TipoArticulo.toString()).subscribe((data: TipoArticulo[]) =>{
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
      console.log('subcategoria'+ data[0]  )      
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