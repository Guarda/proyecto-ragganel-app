import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';
import { AgregarCategoriasAccesoriosComponent } from '../agregar-categorias-accesorios/agregar-categorias-accesorios.component';
import { EditarCategoriasAccesoriosComponent } from '../editar-categorias-accesorios/editar-categorias-accesorios.component';
import { EliminarCategoriasAccesoriosComponent } from '../eliminar-categorias-accesorios/eliminar-categorias-accesorios.component';

@Component({
  selector: 'app-listar-categorias-accesorios',
  imports: [
    CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listar-categorias-accesorios.component.html',
  styleUrl: './listar-categorias-accesorios.component.css'
})
export class ListarCategoriasAccesoriosComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['ImagenCategoria', 'CodigoModeloAccesorio', 'FabricanteAccesorio', 'CategoriaAccesorio', 'SubcategoriaAccesorio', 'Action'];
  dataSource = new MatTableDataSource<CategoriasAccesoriosBase>;

  // Propiedades para manejar estados de UI
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public categorias: CategoriasAccesoriosService,
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
      next: (data: CategoriasAccesoriosBase[]) => {
        const uniqueData = Array.from(new Map(data.map(item => [item.IdModeloAccesorioPK, item])).values());
        uniqueData.forEach(item => {
          item.ImagePath = this.getimagePath(item.LinkImagen);
        });
        this.dataSource.data = uniqueData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar categorías de accesorios:", err);
        this.errorMessage = "No se pudieron cargar las categorías de accesorios.";
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
    const baseUrl = 'http://localhost:3000'; // Asegúrate de que el puerto sea correcto
    if (!link) {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
    }
    return `${baseUrl}/img-accesorios/${link}`;
  }

  // --- Métodos de Diálogos ---

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarCategoriasAccesoriosComponent, {
      width: '55%',
      height: '85%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCategoryList();
      }
    });
  }

  public openDialogEditar(id: string) {
    const dialogRef = this.dialog.open(EditarCategoriasAccesoriosComponent, {
      width: '55%',
      height: '85%',
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
    const dialogRef = this.dialog.open(EliminarCategoriasAccesoriosComponent, {
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