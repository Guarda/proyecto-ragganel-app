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
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';


import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { AgregarCategoriasComponent } from '../agregar-categorias/agregar-categorias.component';
import { EditarCategoriasComponent } from '../editar-categorias/editar-categorias.component';
import { EliminarCategoriasComponent } from '../eliminar-categorias/eliminar-categorias.component';
import { environment } from '../../../../enviroments/enviroments';

@Component({
    selector: 'app-listar-categorias',
    // Módulos importados para el componente standalone
    imports: [
        CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField,
        MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
        MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
    ],
    templateUrl: './listar-categorias.component.html',
    styleUrl: './listar-categorias.component.css',
    schemas: [NO_ERRORS_SCHEMA]
})
export class ListarCategoriasComponent implements AfterViewInit {

  displayedColumns: string[] = ['ImagenCategoria', 'CodigoModeloConsola', 'Fabricante', 'Categoria', 'Subcategoria', 'TipoProducto', 'Action'];
  dataSource = new MatTableDataSource<CategoriasConsolas>;

  // Propiedades para manejar estados de UI
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    public categorias: CategoriasConsolasService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategoryList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCategoryList() {
    this.isLoading = true;
    this.errorMessage = null;

    this.categorias.getAll().subscribe({
      next: (data: CategoriasConsolas[]) => {
        const uniqueData = Array.from(new Map(data.map(item => [item.IdModeloConsolaPK, item])).values());

        uniqueData.forEach(item => {
          item.ImagePath = this.getimagePath(item.LinkImagen);
        });

        this.dataSource.data = uniqueData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar categorías:", err);
        this.errorMessage = "No se pudieron cargar las categorías.";
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getimagePath(link: string | null): string {
    const baseUrl = environment.apiUrl;
    if (!link) {
      return `${baseUrl}/img-consolas/nestoploader.jpg`;
    }
    return `${baseUrl}/img-consolas/${link}`;
  }

  // --- Métodos de Diálogos (simplificados para recargar la lista) ---

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarCategoriasComponent, {
      width: '70%',
      height: '90%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCategoryList();
      }
    });
  }

  public openDialogEditar(id: string) {
    const dialogRef = this.dialog.open(EditarCategoriasComponent, {
      width: '55%',
      height: '90%',
      disableClose: true,
      data: { value: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCategoryList();
      }
    });
  }

  public openDialogEliminar(id: string) {
    const dialogRef = this.dialog.open(EliminarCategoriasComponent, {
      width: '400px',
      disableClose: true,
      data: { value: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCategoryList();
      }
    });
  }
}