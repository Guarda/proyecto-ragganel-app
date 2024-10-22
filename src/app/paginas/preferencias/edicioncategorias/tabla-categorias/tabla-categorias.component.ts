import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { categoriasProductos } from '../../../interfaces/categoriasproductos';
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla-categorias',
  standalone: true,
  imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
  templateUrl: './tabla-categorias.component.html',
  styleUrl: './tabla-categorias.component.css'
})
export class TablaCategoriasComponent {
  displayedColumns: string[] = ['IdCategoria', 'NombreCategoria', 'delete'];

  clickedRows = new Set<categoriasProductos>();

  dataSource = new MatTableDataSource<categoriasProductos>();
  receivedCodigoFabricante!: number;

  constructor(
    public categoriaService: CategoriaProductoService,
    private sharedService: SharedService) {

    

  }

  ngOnInit() {
    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataFabricante$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricante = data;

      // Fetch categories based on the updated fabricante ID
      this.categoriaService.find(String(this.receivedCodigoFabricante)).subscribe((data: categoriasProductos[]) => {
        this.dataSource.data = data;
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
  }

  openDialogAgregar(){

  }

  deleteCategoria(codigo: number){
    this.categoriaService.eliminar(String(codigo)).subscribe((res: any) => {
      console.log(res);
    })
    // Refresh the fabricante list after deletion
    // Fetch categories based on the updated fabricante ID
    this.sharedService.dataFabricante$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricante = data;

      // Fetch categories based on the updated fabricante ID
      this.categoriaService.find(String(this.receivedCodigoFabricante)).subscribe((data: categoriasProductos[]) => {
        this.dataSource.data = data;
      });
    });
  }

  sendData(codigo: number) {
    console.log(codigo);
    this.sharedService.codigoCategoria(codigo);
  }

}
