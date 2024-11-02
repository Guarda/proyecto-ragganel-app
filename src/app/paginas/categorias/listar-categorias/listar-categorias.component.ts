import { AfterViewInit, Component, EventEmitter, Inject, NO_ERRORS_SCHEMA, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatRowDef, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';


import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { AgregarCategoriasComponent } from '../agregar-categorias/agregar-categorias.component';
import { EditarCategoriasComponent } from '../editar-categorias/editar-categorias.component';
import { EliminarCategoriasComponent } from '../eliminar-categorias/eliminar-categorias.component';

@Component({
  selector: 'app-listar-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule, MatRowDef],
  templateUrl: './listar-categorias.component.html',
  styleUrl: './listar-categorias.component.css',
  schemas: [NO_ERRORS_SCHEMA] // Add NO_ERRORS_SCHEMA here
})
export class ListarCategoriasComponent implements AfterViewInit {

  categoriasconsolas: CategoriasConsolas[] = [];
  dataSource = new MatTableDataSource<CategoriasConsolas>;
  link!: string;
  // Other properties
  totalItems: number = 0;

  displayedColumns: string[] = ['ImagenCategoria', 'CodigoModeloConsola', 'Fabricante', 'Categoria', 'Subcategoria', 'TipoProducto', 'Action'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(public categorias: CategoriasConsolasService,
    private cdr: ChangeDetectorRef, private router: Router, private dialog: MatDialog) {

  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarCategoriasComponent, {
      disableClose: true,
      height: '80%',
      width: '57%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      this.getCategoryList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getCategoryList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public openDialogEditar(cons: string) {
    const dialogRef = this.dialog.open(EditarCategoriasComponent, {
      disableClose: true,
      height: '80%',
      width: '50%',
      data: { value: cons }
    });
    dialogRef.componentInstance.Editado.subscribe(() => {
      this.getCategoryList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getCategoryList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public openDialogEliminar(cons: string) {
    const dialogRef = this.dialog.open(EliminarCategoriasComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.getCategoryList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getCategoryList();
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
    this.getCategoryList();
    

  }

  getCategoryList() {
    this.categorias.getAll().subscribe((data: CategoriasConsolas[]) => {
      //this.dataSource = new MatTableDataSource<CategoriasConsolas>(data);

      console.log(data); // Log to inspect the fetched data

      // Eliminate duplicates using 'IdModeloConsolaPK' as the key
      const uniqueData = Array.from(new Map(data.map(item => [item.IdModeloConsolaPK, item])).values());

      // Check if the unique data is truly unique
      // console.log(uniqueData);

      // Set the data source
      this.dataSource = new MatTableDataSource<CategoriasConsolas>(uniqueData);

      // Reapply paginator and sorting
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // Update total item count
      this.totalItems = uniqueData.length;
      // console.log(data);
      data.forEach(item => {
        item.ImagePath = this.getimagePath(item.LinkImagen);
        this.trackByFn(item.IdModeloConsolaPK, item);
      });

      this.cdr.detectChanges();
      // const uniqueData = Array.from(new Map(data.map(item => [item.IdModeloConsolaPK, item])).values());
      // this.dataSource = new MatTableDataSource<CategoriasConsolas>(uniqueData);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    })
  }

  trackByFn(index: number, element: CategoriasConsolas): number {
    return element.IdModeloConsolaPK; // Ensure this ID is unique
  }

  // getimagePath(l: string | null) {
  //   if (l == null || l == '') {
  //     return '/img-consolas/' + 'nestoploader.jpg';
  //   }
  //   else {
  //     return '/img-consolas/' + l;
  //   }
  // }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port
  
    if (l == null || l === '') {
      return `${baseUrl}/img-consolas/nestoploader.jpg`;
    } else {
      return `${baseUrl}/img-consolas/${l}`;
    }
  }
  


  onAdd(a: any) {
    this.ngOnInit();
  }

  ngAfterViewInit() {
    // console.log('Sort instance:', this.sort); // Debugging line
    // console.log('Sortables:', this.sort.sortables);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // Log sort details
  console.log('Active Sort Field:', this.sort.active);
  console.log('Sort Direction:', this.sort.direction);
  }
}
