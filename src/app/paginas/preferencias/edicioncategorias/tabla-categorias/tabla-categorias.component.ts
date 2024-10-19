import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { categoriasProductos } from '../../../interfaces/categoriasproductos';
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-tabla-categorias',
  standalone: true,
  imports: [MatTableModule, MatIcon],
  templateUrl: './tabla-categorias.component.html',
  styleUrl: './tabla-categorias.component.css'
})
export class TablaCategoriasComponent {
  displayedColumns: string[] = ['IdCategoria', 'NombreCategoria', 'delete'];

  clickedRows = new Set<categoriasProductos>();

  selectedCategoria: categoriasProductos[] = [];

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
        this.selectedCategoria = data;
      });
    });
  }

  deleteRow(cons: string) {

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
        this.selectedCategoria = data;
      });
    });
  }

  sendData(codigo: number) {
    console.log(codigo);
    this.sharedService.codigoCategoria(codigo);
  }

}
