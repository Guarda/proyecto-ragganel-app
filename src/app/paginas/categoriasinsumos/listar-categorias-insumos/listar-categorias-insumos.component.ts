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

import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';
import { categoriasInsumos } from '../../interfaces/categoriasinsumos';
import { CategoriasInsumosBase } from '../../interfaces/categoriasinsumosbase';
import { AgregarCategoriasInsumosComponent } from '../agregar-categorias-insumos/agregar-categorias-insumos.component';

@Component({
  selector: 'app-listar-categorias-insumos',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule, MatRowDef],
  templateUrl: './listar-categorias-insumos.component.html',
  styleUrl: './listar-categorias-insumos.component.css'
})
export class ListarCategoriasInsumosComponent {

  categoriasinsumos: CategoriasInsumosBase[] = [];
  dataSource = new MatTableDataSource<CategoriasInsumosBase>;
  link!: string;
  // Other properties
  totalItems: number = 0;

  displayedColumns: string[] = ['ImagenCategoria', 'CodigoModeloInsumo', 'FabricanteInsumo', 'CategoriaInsumo', 'SubcategoriaInsumo', 'Action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public categorias: CategoriasInsumosService,
    private cdr: ChangeDetectorRef, private router: Router, private dialog: MatDialog) {

  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarCategoriasInsumosComponent, {
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

  ngOnInit(): void {
    this.getCategoryList();


  }

  getCategoryList() {
    this.categorias.getAll().subscribe((data: CategoriasInsumosBase[]) => {
      //this.dataSource = new MatTableDataSource<CategoriasConsolas>(data);

      console.log('listado de cat insumos:',data); // Log to inspect the fetched data

      // Eliminate duplicates using 'IdModeloConsolaPK' as the key
      const uniqueData = Array.from(new Map(data.map(item => [item.IdModeloInsumosPK, item])).values());

      // Check if the unique data is truly unique
      // console.log(uniqueData);

      // Set the data source
      this.dataSource = new MatTableDataSource<CategoriasInsumosBase>(uniqueData);

      // Reapply paginator and sorting
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Update total item count
      this.totalItems = uniqueData.length;
      // console.log(data);
      data.forEach(item => {
        item.ImagePath = this.getimagePath(item.LinkImagen);
        this.trackByFn(item.IdModeloInsumosPK, item);
      });

      this.cdr.detectChanges();
      // const uniqueData = Array.from(new Map(data.map(item => [item.IdModeloConsolaPK, item])).values());
      // this.dataSource = new MatTableDataSource<CategoriasConsolas>(uniqueData);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    })
  }

  trackByFn(index: number, element: CategoriasInsumosBase): number {
    return element.IdModeloInsumosPK; // Ensure this ID is unique
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
      return `${baseUrl}/img-insumos/kingston-32gb-clase10.jpg`;
    } else {
      return `${baseUrl}/img-insumos/${l}`;
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
