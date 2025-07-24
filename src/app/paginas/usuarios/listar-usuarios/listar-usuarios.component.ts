import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Usuarios } from '../../interfaces/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { CrearUsuariosComponent } from '../crear-usuarios/crear-usuarios.component';
import { DesactivarUsuarioComponent } from '../desactivar-usuario/desactivar-usuario.component';
// Importa el componente de eliminar si lo tienes, si no, puedes omitir esta línea
// import { EliminarUsuarioComponent } from '../eliminar-usuario/eliminar-usuario.component';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['IdUsuarioPK', 'Nombre', 'Correo', 'DescripcionEstado', 'FechaIngresoUsuario', 'NombreRol', 'Action'];
  dataSource = new MatTableDataSource<Usuarios>();

  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public usuarioService: UsuariosService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUsuarioList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsuarioList() {
    this.isLoading = true;
    this.errorMessage = null;

    this.usuarioService.getAll().subscribe({
      next: (data: Usuarios[]) => {
        const datosProcesados = data.map(usuario => ({
          ...usuario,
          FechaIngresoUsuario: this.parsearFecha(usuario.FechaIngresoUsuario)
        }));
        this.dataSource.data = datosProcesados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar usuarios:", err);
        this.errorMessage = "No se pudieron cargar los usuarios.";
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

  private parsearFecha(fechaStr: string | Date | undefined): Date {
    // Si no hay fecha o ya es un objeto Date, lo gestionamos.
    if (!fechaStr) return new Date('Invalid Date');
    if (fechaStr instanceof Date) return fechaStr;

    // Primero, intentamos la conversión directa (funciona para YYYY-MM-DD e ISO)
    let fecha = new Date(fechaStr);
    if (!isNaN(fecha.getTime())) {
      return fecha;
    }

    // Si falla, intentamos el formato "dd/MM/yyyy"
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1; // Meses en JS son 0-11
      const anio = parseInt(partes[2], 10);
      if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
        return new Date(anio, mes, dia);
      }
    }

    // Si todo falla, es un formato no reconocido
    return new Date('Invalid Date');
  }

  getEstadoClass(status: string): string {
    if (!status) return 'status-default';
    switch (status.toLowerCase()) {
      case 'activo': return 'status-activo';
      case 'inactivo': return 'status-inactivo';
      default: return 'status-default';
    }
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(CrearUsuariosComponent, {
      width: '500px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsuarioList();
      }
    });
  }

  public openDialogEliminar(idUsuario: number) {
    const dialogRef = this.dialog.open(DesactivarUsuarioComponent, {
      width: '400px',
      disableClose: true,
      data: { value: idUsuario }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsuarioList();
      }
    });    
  }
}