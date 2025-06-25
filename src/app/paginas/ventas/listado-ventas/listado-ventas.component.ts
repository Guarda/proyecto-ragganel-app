import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { VentasBaseService } from '../../../services/ventas-base.service';
import { Usuarios } from '../../interfaces/usuarios'; // Ajusta la ruta a tu interfaz
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ventas } from '../../interfaces/ventas';
import { AuthService } from '../../../UI/session/auth.service';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule,  // --- AGREGA ESTOS DOS ---
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-NI'}],
  styleUrls: ['./listado-ventas.component.css']
})
export class ListadoVentasComponent implements OnInit, AfterViewInit {
  ventas: Ventas[] = [];
  myArray: any[] = [];
  displayedColumns: string[] = ['Numero_Venta', 'Fecha_Creacion', 'TipoDocumento', 'NumeroDocumento', 'Subtotal', 'Iva', 'TotalVenta', 'Cliente', 'Usuario', 'Action'];
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<Ventas>;
  usuario!: Usuarios; // o usuario: Usuarios | null = null;

  fechaInicio: string = '';
  fechaFin: string = '';


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // --- AGREGA ESTA LÍNEA ---
  // Captura la referencia #input del HTML
  @ViewChild('input') inputBusqueda!: ElementRef<HTMLInputElement>;
  @Output() select = new EventEmitter<string>();

  constructor(private ventasService: VentasBaseService,
    private authService: AuthService,) { }

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.authService.getUser().subscribe((usuariok: any) => {
      this.usuario = usuariok;
      console.log('Usuario autenticado:', usuariok);
      // Si necesitas convertirlo a tu tipo Usuarios, hazlo aquí manualmente
      // this.usuario = usuario ? [usuario as Usuarios] : [];
    });

    if (this.usuario) {
      this.ventasService.listarVentasPorUsuario(this.usuario).subscribe(
        (data: Ventas[]) => {
          this.ventas = data;
          this.dataSource.data = this.ventas;
        },
        (error) => {
          console.error('Error al cargar las ventas:', error);
        }
      );
    } else {
      console.error('Usuario no encontrado');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltros(): void {
     // --- POR ESTA LÍNEA CORRECTA ---
    const texto = this.inputBusqueda.nativeElement.value;
    // Pasamos un objeto JSON como string para manejar ambos filtros a la vez
    const filterValue = JSON.stringify({ texto: texto });
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // --- LÓGICA DE FILTRADO COMBINADA Y MEJORADA ---
  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Ventas, filter: string): boolean => {
      const searchString = JSON.parse(filter);

      // Normalizar las fechas a medianoche para evitar problemas con la hora
      const fechaVenta = new Date(data.FechaCreacion);
      fechaVenta.setHours(0, 0, 0, 0);

      const inicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
      if (inicio) inicio.setHours(0, 0, 0, 0);

      const fin = this.fechaFin ? new Date(this.fechaFin) : null;
      if (fin) fin.setHours(0, 0, 0, 0);

      // Comprobación de fechas
      const fechaValida = (!inicio || fechaVenta >= inicio) && (!fin || fechaVenta <= fin);

      // Comprobación de texto de búsqueda
      const textoBusqueda = searchString.texto.trim().toLowerCase();
      if (!textoBusqueda) {
        return fechaValida;
      }

      const ventaString = `${data.IdVentaPK} ${data.TipoDocumento} ${data.NumeroDocumento} ${data.Cliente} ${data.Usuario}`.toLowerCase();
      const textoValido = ventaString.includes(textoBusqueda);

      return fechaValida && textoValido;
    };
  }


  applyFilter(event: Event) {
    this.aplicarFiltros();   
  }

}