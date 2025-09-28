import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
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

import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';
import { CategoriasInsumosBase } from '../../interfaces/categoriasinsumosbase';
import { AgregarCategoriasInsumosComponent } from '../agregar-categorias-insumos/agregar-categorias-insumos.component';
import { EditarCategoriasInumosComponent } from '../editar-categorias-inumos/editar-categorias-inumos.component';
import { EliminarCategoriasInsumosComponent } from '../eliminar-categorias-insumos/eliminar-categorias-insumos.component';

@Component({
  selector: 'app-listar-categorias-insumos',
  imports: [
    CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listar-categorias-insumos.component.html',
  styleUrl: './listar-categorias-insumos.component.css'
})
export class ListarCategoriasInsumosComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['ImagenCategoria', 'CodigoModeloInsumo', 'FabricanteInsumo', 'CategoriaInsumo', 'SubcategoriaInsumo', 'Action'];
  dataSource = new MatTableDataSource<CategoriasInsumosBase>;

  // Propiedades para manejar estados de UI
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public categorias: CategoriasInsumosService,
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
      next: (data: CategoriasInsumosBase[]) => {
        const uniqueData = Array.from(new Map(data.map(item => [item.IdModeloInsumosPK, item])).values());
        uniqueData.forEach(item => {
          item.ImagePath = this.getimagePath(item.LinkImagen);
        });
        this.dataSource.data = uniqueData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar categorías de insumos:", err);
        this.errorMessage = "No se pudieron cargar las categorías de insumos.";
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
    const baseUrl = 'http://localhost:3000';
    if (!link) {
      return `${baseUrl}/img-insumos/kingston-32gb-clase10.jpg`;
    }
    return `${baseUrl}/img-insumos/${link}`;
  }

  // --- Métodos de Diálogos ---

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarCategoriasInsumosComponent, {
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
    const dialogRef = this.dialog.open(EditarCategoriasInumosComponent, {
      width: '55%', // Homologado con el diálogo de agregar
      height: '85%', // Homologado con el diálogo de agregar
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
    const dialogRef = this.dialog.open(EliminarCategoriasInsumosComponent, {
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