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
import { MatDialog} from '@angular/material/dialog';
import { AgregarServicioComponent } from '../agregar-servicio/agregar-servicio.component';

@Component({
  selector: 'app-listado-servicios',
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
  templateUrl: './listado-servicios.component.html',
  styleUrl: './listado-servicios.component.css'
})
export class ListadoServiciosComponent implements AfterViewInit {
  displayedColumns: string[] = ['IdServicio', 'DescripcionServicio', 'Estado', 'Fecha_Ingreso', 'PrecioBase', 'Comentario', 'Action'];
  dataSource = new MatTableDataSource<any>(); // Cambia el tipo a 'any' o define una interfaz adecuada

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() select = new EventEmitter<string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngAfterViewInit() {

  }

  public openDialogAgregar() {
      const dialogRef = this.dialog.open(AgregarServicioComponent, {
        disableClose: true,
        height: '80%',
        width: '55%',
      });
    }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
