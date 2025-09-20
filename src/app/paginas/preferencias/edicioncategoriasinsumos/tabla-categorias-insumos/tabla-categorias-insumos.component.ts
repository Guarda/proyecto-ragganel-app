import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { categoriasInsumos } from '../../../interfaces/categoriasinsumos';
import { CategoriaInsumoService } from '../../../../services/categoria-insumo.service';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AgregarCategoriasInsumosDialogComponent } from '../agregar-categorias-insumos-dialog/agregar-categorias-insumos-dialog.component';
import { EliminarCategoriasInsumosDialogComponent } from '../eliminar-categorias-insumos-dialog/eliminar-categorias-insumos-dialog.component';

@Component({
    selector: 'app-tabla-categorias-insumos',
    imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
    templateUrl: './tabla-categorias-insumos.component.html',
    styleUrls: ['./tabla-categorias-insumos.component.css']
})
export class TablaCategoriasInsumosComponent {

  displayedColumns: string[] = ['IdCategoria', 'NombreCategoria', 'delete'];

  clickedRows = new Set<categoriasInsumos>();

  dataSource = new MatTableDataSource<categoriasInsumos>();
  receivedCodigoFabricanteInsumo!: number;
  receivedNombreFabricanteInsumo!: string;

  constructor(
    public categoriaService: CategoriaInsumoService,
    private sharedService: SharedService,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.sharedService.dataFabricanteInsumo$.subscribe(data => {
      this.receivedCodigoFabricanteInsumo = data;

      this.categoriaService.find(String(this.receivedCodigoFabricanteInsumo)).subscribe((data: categoriasInsumos[]) => {
        this.dataSource.data = data;
      });
    });

    this.sharedService.dataNombreFabricanteInsumo$.subscribe(data => {
      this.receivedNombreFabricanteInsumo = data.toString();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogAgregar(IdFab: number, FabricanteName: string) {
    const dialogRef = this.dialog.open(AgregarCategoriasInsumosDialogComponent, {
      disableClose: true,
      data: { 
        value: IdFab,
        name: FabricanteName 
      },
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      this.cargarCategoriasxFabricante();
    });
  }

  cargarCategoriasxFabricante() {
    this.sharedService.dataFabricanteInsumo$.subscribe(data => {
      this.receivedCodigoFabricanteInsumo = data;

      this.categoriaService.find(String(this.receivedCodigoFabricanteInsumo)).subscribe((data: categoriasInsumos[]) => {
        this.dataSource.data = data;
      });
    });
  }

  deleteCategoria(codigo: number, nombre: string) {
    const dialogRef = this.dialog.open(EliminarCategoriasInsumosDialogComponent, {
      disableClose: true,
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.cargarCategoriasxFabricante();
    });
  }

  sendData(codigo: number, nombre: string) {
    this.sharedService.codigoCategoriaInsumo(codigo);
    this.sharedService.nombreCategoriaInsumo(nombre);
  }
}
