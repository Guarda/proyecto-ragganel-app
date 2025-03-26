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

import { Usuarios } from '../../interfaces/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { CrearUsuariosComponent } from '../crear-usuarios/crear-usuarios.component';
import { VerUsuarioComponent } from '../ver-usuario/ver-usuario.component';

@Component({
  selector: 'app-listar-usuarios',
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
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css'
})
export class ListarUsuariosComponent {

  usuarios: Usuarios[] = [];
  displayedColumns: string[] = ['CodigoUsuario', 'NombreUsuario', 'Correo', 'Estado', 'FechaIngresoUsuario', 'Rol', 'Action'];

  dataSource = new MatTableDataSource<Usuarios>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() select = new EventEmitter<string>();

  constructor(
    public usuarioService: UsuariosService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {

  }



  /**
  * Write code on Method
  *
  * @return response()
  */
  ngOnInit(): void {
    this.getUsuarioList();
  }

  getUsuarioList() {
    this.usuarioService.getAll().subscribe((data: Usuarios[]) => {
      this.dataSource = new MatTableDataSource<Usuarios>(data);
      // console.log(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(CrearUsuariosComponent, {
      disableClose: true,
      height: '80%',
      width: '30%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      this.getUsuarioList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getUsuarioList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  onAdd(a: any) {
    this.ngOnInit();
  }

  ngAfterViewInit() {

  }

  onSelectedProduct() {
    // this.select.emit(this.);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
