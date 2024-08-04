import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ProductosService } from '../productos.service';
import { Producto } from '../../interfaces/producto';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatFormFieldModule, MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule
  ],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements AfterViewInit {
  productos: Producto[] = [];
  myArray: any[] = [];
  displayedColumns: string[] = ['CodigoConsola', 'DescripcionConsola', 'Color', 'Estado', 'Hack', 'Fecha_Ingreso', 'Comentario', 'Action'];
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<Producto>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public productoService: ProductosService, private cdr: ChangeDetectorRef, private router: Router,) {

  }

  /**
  * Write code on Method
  *
  * @return response()
  */
  ngOnInit(): void {
    this.productoService.getAll().subscribe((data: Producto[]) => {
      this.dataSource = new MatTableDataSource<Producto>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

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
