import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // NUEVO: Para navegar
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// --- NUEVAS IMPORTACIONES DE ANGULAR MATERIAL ---
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
// --- FIN NUEVAS IMPORTACIONES ---

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../UI/session/auth.service';
import { Usuarios } from '../../interfaces/usuarios';
import { CarritoService } from '../../../services/carrito.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmarLiberacionDialogComponent } from '../confirmar-liberacion-dialog/confirmar-liberacion-dialog.component';

@Component({
    selector: 'app-listado-carritos',
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        // --- MÓDULOS AÑADIDOS ---
        MatTableModule,
        MatButtonModule,
        MatTooltipModule,
        MatDialogModule
    ],
    templateUrl: './listado-carritos.component.html',
    styleUrls: ['./listado-carritos.component.css']
})
export class ListadoCarritosComponent implements OnInit {

  public carritos: any[] = [];
  public isLoading = true;
  private usuario?: Usuarios;

  // NUEVO: Columnas a mostrar en la tabla
  displayedColumns: string[] = ['IdCarritoPK', 'NombreCliente', 'UsuarioCreador', 'FechaCreacion', 'acciones'];

  constructor(
    private carritoService: CarritoService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarioYcargarCarritos();
  }

  obtenerUsuarioYcargarCarritos(): void {
    // ... (este método no cambia)
    this.isLoading = true;
    this.authService.getUser().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.usuario = user as unknown as Usuarios;
          this.cargarCarritos(this.usuario.id);
        } else {
          this.snackBar.open('No se pudo verificar el usuario.', 'Cerrar', { duration: 4000 });
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener el usuario autenticado:', err);
        this.snackBar.open('Error crítico al verificar la sesión.', 'Cerrar', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }
  
  cargarCarritos(idUsuario: number): void {
    // ... (este método no cambia)
    this.isLoading = true; 
    this.carritoService.listarCarritosActivosPorUsuario(idUsuario)
      .pipe(
        finalize(() => {
          this.isLoading = false; 
          console.log('La llamada HTTP ha finalizado (éxito o error).');
        })
      )
      .subscribe({
        next: (datosRecibidos) => {
          this.carritos = datosRecibidos;
        },
        error: (err) => {
          console.error('SUSCRIPCIÓN MANUAL FALLÓ. Error:', err);
          this.carritos = []; 
          this.snackBar.open('No se pudieron cargar los carritos activos.', 'Cerrar', {
            duration: 4000,
          });
        }
      });
  }

  // --- NUEVOS MÉTODOS PARA LAS ACCIONES DE LA TABLA ---

  /**
   * Notifica al servicio qué carrito cargar y navega al punto de venta.
   */
  verCarrito(carrito: any): void {
    this.carritoService.solicitarCargaDeCarrito(carrito);
    this.router.navigate(['home/punto-venta']);
  }

  
  liberarCarrito(idCarrito: number, event: MouseEvent): void {
    event.stopPropagation(); // Evita que se dispare el click de la fila

    // 1. Abrir el diálogo
    const dialogRef = this.dialog.open(ConfirmarLiberacionDialogComponent, {
      width: '400px',
      data: { idCarrito: idCarrito } // Pasamos el ID del carrito al diálogo
    });

    // 2. Suscribirse al resultado del diálogo
    dialogRef.afterClosed().subscribe(result => {
      // 3. Si el resultado es 'true', el usuario confirmó la acción
      if (result === true) {
        this.isLoading = true;
        this.carritoService.liberarCarrito(idCarrito).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Carrito liberado con éxito.', 'Cerrar', { duration: 2000 });
              this.carritos = this.carritos.filter(c => c.IdCarritoPK !== idCarrito);
            } else {
              this.snackBar.open(`Error al liberar: ${response.error}`, 'Cerrar', { duration: 4000 });
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.snackBar.open('Error de conexión al liberar el carrito.', 'Cerrar', { duration: 4000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
}