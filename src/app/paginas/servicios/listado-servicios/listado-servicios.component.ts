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
import { AgregarServicioComponent } from '../agregar-servicio/agregar-servicio.component';
import { ServiciosService } from '../../../services/servicios.service';
import { ServiciosBase } from '../../interfaces/servicios';
import { EliminarServicioComponent } from '../eliminar-servicio/eliminar-servicio.component';

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
  displayedColumns: string[] = ['IdServicio', 'DescripcionServicio', 'Fecha_Ingreso', 'PrecioBase', 'Comentario', 'Action'];
  dataSource = new MatTableDataSource<any>(); // Cambia el tipo a 'any' o define una interfaz adecuada

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() select = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private serviciosService: ServiciosService // Cambia 'InsumosBaseService' por el servicio adecuado para 'ServiciosBase'
  ) { }

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.getSupplyList();
  }

  getSupplyList() {
    this.serviciosService.getAll().subscribe((data: ServiciosBase[]) => {
      this.dataSource = new MatTableDataSource<ServiciosBase>(data);
      console.log(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarServicioComponent, {
      disableClose: true,
      height: '80%',
      width: '55%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDialogEliminar(cons: string) {
    const dialogRef = this.dialog.open(EliminarServicioComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
