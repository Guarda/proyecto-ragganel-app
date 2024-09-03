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

import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { AgregarCategoriasComponent } from '../agregar-categorias/agregar-categorias.component';

@Component({
  selector: 'app-listar-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule],
  templateUrl: './listar-categorias.component.html',
  styleUrl: './listar-categorias.component.css'
})
export class ListarCategoriasComponent implements AfterViewInit {

  categoriasconsolas: CategoriasConsolas[] = [];
  dataSource = new MatTableDataSource<CategoriasConsolas>;
  link!: string;

  displayedColumns: string[] = ['ImagenCategoria', 'CodigoModeloConsola', 'DescripcionConsola', 'Fabricante', 'Action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor(public categorias: CategoriasConsolasService,
    private cdr: ChangeDetectorRef, private router: Router, private dialog: MatDialog) {

  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarCategoriasComponent, {
      height: '70%',
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
      this.dataSource = new MatTableDataSource<CategoriasConsolas>(data);

      data.forEach(item => {
        item.ImagePath = this.getimagePath(item.LinkImagen);
      });

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;      
    })
  }

  getimagePath(l: string | null)  {
    if (l == null ){
      return '/img-consolas/' + 'nestoploader.webp';
    }
    else {
      return '/img-consolas/' + l;
    }    
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
