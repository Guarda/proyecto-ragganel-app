import { AfterViewInit, Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { Producto } from '../../interfaces/producto';
import { ProductosService } from '../productos.service';
import { AgregarProdutosComponent } from '../agregar-produtos/agregar-produtos.component';
import { EditarProductosComponent } from '../editar-productos/editar-productos.component';
import { EliminarProductosComponent } from '../eliminar-productos/eliminar-productos.component';


@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatLabel, 
    MatFormField, 
    MatInputModule,
    MatInputModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatIcon, 
    MatButtonModule    
  ],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements AfterViewInit {
  productos: Producto[] = [];
  myArray: any[] = [];
  displayedColumns: string[] = ['CodigoConsola', 'DescripcionConsola', 'Color', 'Estado', 'Hack', 'Fecha_Ingreso', 'PrecioBase','Comentario', 'Action'];
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<Producto>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() select = new EventEmitter<string>();

  constructor(public productoService: ProductosService, private cdr: ChangeDetectorRef, private router: Router, private dialog: MatDialog) {

  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarProdutosComponent, {
      disableClose: true,
      height: '100%',
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
 
  public openDialogEliminar(cons: string){
    const dialogRef = this.dialog.open(EliminarProductosComponent, {  
      disableClose: true,   
      data: { value: cons }      
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
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

  onSelectedProduct() {
    // this.select.emit(this.);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }







}
