import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// 1. Importar el servicio y la interfaz
import { TiposProductosService } from '../../../../services/tipos-productos.service';
import { TipoProducto } from '../../../interfaces/tipoproducto'; // La interfaz base sigue siendo útil

@Component({
  selector: 'app-eliminar-tipo-producto',
  standalone: true, 
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatProgressSpinnerModule
  ],
  templateUrl: './eliminar-tipo-producto.component.html',
  styleUrl: './eliminar-tipo-producto.component.css'
})
export class EliminarTipoProductoComponent implements OnInit {

  @Output() Inactivado = new EventEmitter();
  
  public tipoProductoId: number;
  
  // **** CAMBIO AQUÍ ****
  // Cambiamos el tipo de 'TipoProducto' a 'any'
  public tipoProductoData!: any; 
  
  public isLoading = true;
  public errorMessage: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<EliminarTipoProductoComponent>,
    public tiposProductosService: TiposProductosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tipoProductoId = data.value;
  }

  ngOnInit(): void {
    this.tiposProductosService.find(this.tipoProductoId).subscribe({
      
      // **** CAMBIO AQUÍ ****
      // Aceptamos 'data' como 'any'
      next: (data: any) => { 
        this.tipoProductoData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "No se pudo cargar el tipo de producto para inactivarlo.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onInactivar(): void {
    if (!this.tipoProductoData) {
      this.errorMessage = "No hay datos del producto para actualizar.";
      return;
    }

    this.isLoading = true; 
    this.errorMessage = null;

    // Ahora esto funcionará sin errores de TypeScript
    const dataToUpdate = { 
      IdTipoProductoPK: this.tipoProductoData.IdTipoProductoPK,
      descripcion: this.tipoProductoData.DescripcionTipoProducto, 
      activo: false,                                              
      accesorios: this.tipoProductoData.accesorios                
    };

    // Llamamos al servicio 'update'
    this.tiposProductosService.update(dataToUpdate as any).subscribe({
      next: (res: any) => {
        this.Inactivado.emit(); 
        this.dialogRef.close(true); 
      },
      error: (err) => {
        this.errorMessage = "Ocurrió un error al inactivar el producto.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}