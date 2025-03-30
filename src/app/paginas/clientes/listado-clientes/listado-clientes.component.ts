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

import { Cliente } from '../../interfaces/clientes';
import { ClientesService } from '../../../services/clientes.service';
import { CrearClienteComponent } from '../crear-cliente/crear-cliente.component';
import { EliminarClienteComponent } from '../eliminar-cliente/eliminar-cliente.component';
@Component({
  selector: 'app-listado-clientes',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    MatTableModule,
    MatLabel,
    MatFormField,
    MatInputModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatIcon,
    MatButtonModule],
  templateUrl: './listado-clientes.component.html',
  styleUrl: './listado-clientes.component.css'
})
export class ListadoClientesComponent {

  clientes: Cliente[] = [];
  myArray: any[] = [];
  displayedColumns: string[] = [ 'nombre', 'dni', 'ruc', 'telefono', 'email', 'direccion', 'fechaRegistro', 'estado', 'acciones'];	
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() select = new EventEmitter<string>();

  constructor(public clienteService: ClientesService, private cdr: ChangeDetectorRef, private router: Router, private dialog: MatDialog) {

  }

  public openDialogAgregar() {
      const dialogRef = this.dialog.open(CrearClienteComponent, {
        disableClose: true,
        height: '100%',
        width: '30%',
      });
      dialogRef.componentInstance.Agregado.subscribe(() => {
       this.getClientList();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      dialogRef.afterClosed().subscribe(() => {
        this.getClientList();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

    public openDialogEliminar(cons: string) {
        const dialogRef = this.dialog.open(EliminarClienteComponent, {
          disableClose: true,
          data: { value: cons }
        });
        dialogRef.componentInstance.Eliminar.subscribe(() => {
          this.getClientList();
          this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        });
        dialogRef.afterClosed().subscribe(() => {
          this.getClientList();
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
        this.getClientList();
      }
    
      getClientList() {
        this.clienteService.getAll().subscribe((data: Cliente[]) => {
          this.dataSource = new MatTableDataSource<Cliente>(data);
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
    
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
}
