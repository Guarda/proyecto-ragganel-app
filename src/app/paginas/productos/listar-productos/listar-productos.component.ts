import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ProductosService } from '../productos.service';
import { Producto } from '../../interfaces/producto';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { AgregarProdutosComponent } from '../agregar-produtos/agregar-produtos.component';
import { DialogConfig } from '@angular/cdk/dialog';
import { EditarProductosComponent } from '../editar-productos/editar-productos.component';


@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatFormFieldModule, MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule, AgregarProdutosComponent
  ],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements AfterViewInit {
  productos: Producto[] = [];
  myArray: any[] = [];
  displayedColumns: string[] = ['CodigoConsola', 'DescripcionConsola', 'Color', 'Estado', 'Hack', 'Fecha_Ingreso', 'Comentario', 'Action'];
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<Producto>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public productoService: ProductosService, private cdr: ChangeDetectorRef, private router: Router, private dialog: MatDialog) {

  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarProdutosComponent, {
      height: '85%',
      width: '50%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      this.getProductList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getProductList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public openDialogEditar() {
    const dialogRef = this.dialog.open(EditarProductosComponent, {
      height: '85%',
      width: '50%',
    });
  }



  /**
  * Write code on Method
  *
  * @return response()
  */
  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    this.productoService.getAll().subscribe((data: Producto[]) => {
      this.dataSource = new MatTableDataSource<Producto>(data);
      console.log(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onAdd(a: any) {
    this.ngOnInit();
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }







}
