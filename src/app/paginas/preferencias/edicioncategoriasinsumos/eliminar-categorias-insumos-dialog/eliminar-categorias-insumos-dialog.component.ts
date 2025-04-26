import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { categoriasInsumos } from '../../../interfaces/categoriasinsumos';
import { CategoriaInsumoService } from '../../../../services/categoria-insumo.service';

@Component({
  selector: 'app-eliminar-categorias-insumos-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions, MatButton, MatButtonModule],
  templateUrl: './eliminar-categorias-insumos-dialog.component.html',
  styleUrls: ['./eliminar-categorias-insumos-dialog.component.css']
})
export class EliminarCategoriasInsumosDialogComponent {

  Borrado = new EventEmitter();
  receivedCodigoCategoriaInsumo!: number;
  receivedNombreCategoriaInsumo!: string;

  constructor(
    public categoriaService: CategoriaInsumoService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
  ) {
  }

  ngOnInit(): void {
    // Subscribe to the shared service to listen for the updated categoria ID
    this.sharedService.dataCategoriaInsumo$.subscribe(data => {
      this.receivedCodigoCategoriaInsumo = data;
    });
    // Subscribe to the shared service to listen for the updated categoria name
    this.sharedService.dataNombreCategoriaInsumo$.subscribe(data => {
      this.receivedNombreCategoriaInsumo = data.toString();
    });
  }

  onEliminar() {
    this.categoriaService.eliminar(String(this.receivedCodigoCategoriaInsumo)).subscribe((res: any) => {
      console.log(res);
      // Refresh the categoria list after deletion
      this.categoriaService.getAll().subscribe((data: categoriasInsumos[]) => {
        this.Borrado.emit();
        this.sharedService.codigoCategoriaInsumo(0);
        this.router.navigateByUrl('home/preferencias/index-categorias-insumos');
      });
    });
  }
}