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
import { AccesoriosBase } from '../../interfaces/accesoriosbase';
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { AgregarAccesoriosComponent } from '../agregar-accesorios/agregar-accesorios.component';
import { EliminarAccesoriosComponent } from '../eliminar-accesorios/eliminar-accesorios.component';

@Component({
  selector: 'app-listar-accesorios',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule],
  templateUrl: './listar-accesorios.component.html',
  styleUrl: './listar-accesorios.component.css'
})
export class ListarAccesoriosComponent {
  accesorios: AccesoriosBase[] = [];

  dataSource = new MatTableDataSource<AccesoriosBase>;
  displayedColumns: string[] = ['CodigoAccesorio', 'ColorAccesorio', 'EstadoAccesorio', 'FechaIngreso', 'PrecioBase','Comentario','Action'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public accesorioService: AccesorioBaseService, private cdr: ChangeDetectorRef, private router: Router, private dialog: MatDialog) {

  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarAccesoriosComponent, {
      disableClose: true,
      height: '100%',
      width: '50%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      this.getAccesorioList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAccesorioList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public openDialogEliminar(cons: string){
    const dialogRef = this.dialog.open(EliminarAccesoriosComponent, {  
      disableClose: true,   
      data: { value: cons }      
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.getAccesorioList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAccesorioList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {
    this.getAccesorioList();
  }

  getAccesorioList() {
    this.accesorioService.getAll().subscribe((data: AccesoriosBase[]) => {
      this.dataSource = new MatTableDataSource<AccesoriosBase>(data);
      console.log(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onAdd(a: any) {
    this.ngOnInit();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
