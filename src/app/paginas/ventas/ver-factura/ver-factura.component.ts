// En: ver-factura.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VentasBaseService } from '../../../services/ventas-base.service';
import { VentaCompleta } from '../../interfaces/ventacompleta';
import { DetalleVentaCompleta } from '../../interfaces/detalleventacompleta';
import { MatSnackBar } from '@angular/material/snack-bar';

// Módulos de Angular Material
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Componentes y Servicios necesarios
import { CrearNotaCreditoComponent } from '../crear-nota-credito/crear-nota-credito.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../UI/session/auth.service';
import { NotasCreditoService } from '../../../services/notas-credito.service';
import { Usuarios } from '../../interfaces/usuarios';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ver-factura',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatListModule, MatDividerModule, MatProgressSpinnerModule
  ],
  templateUrl: './ver-factura.component.html',
  styleUrls: ['./ver-factura.component.css']
})
export class VerFacturaComponent implements OnInit {

  venta: VentaCompleta | null = null;
  detalles: DetalleVentaCompleta[] = [];
  usuario: Usuarios | null = null;
  subtotalBruto = 0;
  totalDescuentos = 0;
  private subs = new Subscription();
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ventasService: VentasBaseService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private creditNotesService: NotasCreditoService
  ) { }

  ngOnInit(): void {
    // Es buena práctica usar una suscripción para limpiar la memoria después.
    this.subs.add(
      this.authService.getUser().subscribe(user => {
        // Asegúrate de que el objeto 'user' tenga la estructura de 'Usuarios'
        this.usuario = user as unknown as Usuarios;
      })
    );

    const idVenta = this.route.snapshot.paramMap.get('CodigoVenta');
    if (idVenta) {
      this.cargarDatosFactura(+idVenta);
    } else {
      this.isLoading = false;
      this.errorMessage = 'No se encontró un ID de factura en la URL.';
      this.router.navigate(['/home/listado-ventas']);
    }
  }

  // El método ngOnDestroy es una buena práctica para evitar fugas de memoria.
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  cargarDatosFactura(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.ventasService.getVentaCompleta(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.venta = response.data.venta;
          this.detalles = response.data.detalles;
          this.totalDescuentos = this.detalles.reduce((acc, item) =>
            acc + (item.PrecioUnitario * item.Cantidad - item.SubtotalLinea), 0);
          this.subtotalBruto = (this.venta?.SubtotalVenta || 0) + this.totalDescuentos;
        } else {
          this.errorMessage = 'No se pudieron cargar los datos de la factura.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error de comunicación al obtener los datos de la factura.';
        console.error(err);
      }
    });
  }

  // ===== INICIO DE LA CORRECCIÓN =====
  abrirDialogoNotaCredito(): void {
    if (!this.venta || !this.detalles || !this.usuario) {
      this.snackBar.open('No se pueden cargar los datos necesarios para la nota de crédito.', 'Cerrar', { duration: 4000 });
      return;
    }

    const dialogRef = this.dialog.open(CrearNotaCreditoComponent, {
      width: '800px',
      data: {
        venta: this.venta,
        detalles: this.detalles,
        usuario: this.usuario
      }
    });

    dialogRef.afterClosed().subscribe(resultadoDialogo => {
      if (resultadoDialogo) {
        // **LÓGICA CLAVE ADAPTADA DE 'listado-ventas.component.ts'**
        // 1. Construimos el objeto que la API espera.
        const datosParaApi = {
          IdVentaFK: this.venta!.IdVentaPK, // Usamos el ID de la venta actual
          UsuarioEmisorFK: this.usuario!.id, // Usamos el ID del usuario en sesión
          IdMotivoFK: resultadoDialogo.IdMotivoFK,
          Observaciones: resultadoDialogo.Observaciones,
          TotalCredito: resultadoDialogo.TotalCredito,
          EsDevolucionCompleta: resultadoDialogo.EsDevolucionCompleta,
          Detalles: resultadoDialogo.Detalles
        };

        this.snackBar.open('Registrando Nota de Crédito...', undefined, { duration: 3000 });

        // 2. Enviamos el objeto construido, no el resultado directo del diálogo.
        this.creditNotesService.crearNotaCredito(datosParaApi).subscribe({
          next: (respuestaApi) => {
            this.snackBar.open(respuestaApi.mensaje || 'Nota de crédito creada con éxito.', 'OK', {
              duration: 5000,
              panelClass: ['snackbar-success']
            });
            this.router.navigate(['/home/listado-ventas']);
          },
          error: (err) => {
            console.error("Error al crear la nota de crédito:", err);
            this.snackBar.open('Error al registrar la nota de crédito. Revise la consola.', 'Cerrar', {
              duration: 6000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }
  // ===== FIN DE LA CORRECCIÓN =====
}